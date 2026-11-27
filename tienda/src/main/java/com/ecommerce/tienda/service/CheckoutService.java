package com.ecommerce.tienda.service;

import com.ecommerce.tienda.dto.CheckoutItemRequest;
import com.ecommerce.tienda.dto.CheckoutRequest;
import com.ecommerce.tienda.dto.CheckoutResponse;
import com.ecommerce.tienda.model.DireccionModel;
import com.ecommerce.tienda.model.DetallePedidoModel;
import com.ecommerce.tienda.model.PagoModel;
import com.ecommerce.tienda.model.PedidoModel;
import com.ecommerce.tienda.model.ProductoModel;
import com.ecommerce.tienda.model.VarianteModel;
import com.ecommerce.tienda.repository.DetallePedidoRepository;
import com.ecommerce.tienda.repository.DireccionRepository;
import com.ecommerce.tienda.repository.PagoRepository;
import com.ecommerce.tienda.repository.PedidoRepository;
import com.ecommerce.tienda.repository.ProductoRepository;
import com.ecommerce.tienda.repository.UsuarioRepository;
import com.ecommerce.tienda.repository.VarianteRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class CheckoutService {

    private static final BigDecimal COSTO_ENVIO = new BigDecimal("10000");
    private static final String ESTADO_INICIAL = "PAGADO";

    private final UsuarioRepository usuarioRepository;
    private final DireccionRepository direccionRepository;
    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final PagoRepository pagoRepository;
    private final VarianteRepository varianteRepository;
    private final ProductoRepository productoRepository;

    public CheckoutService(
        UsuarioRepository usuarioRepository,
        DireccionRepository direccionRepository,
        PedidoRepository pedidoRepository,
        DetallePedidoRepository detallePedidoRepository,
        PagoRepository pagoRepository,
        VarianteRepository varianteRepository,
        ProductoRepository productoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.direccionRepository = direccionRepository;
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.pagoRepository = pagoRepository;
        this.varianteRepository = varianteRepository;
        this.productoRepository = productoRepository;
    }

    public CheckoutResponse checkout(CheckoutRequest request) {
        validar(request);
        String medio = request.medio().trim().toUpperCase();

        Map<Integer, Integer> cantidades = new LinkedHashMap<>();
        List<CheckoutItemRequest> items = request.items();
        for (CheckoutItemRequest item : items) {
            cantidades.merge(item.idVariante(), item.cantidad(), Integer::sum);
        }

        Map<Integer, BigDecimal> precios = new LinkedHashMap<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        for (Map.Entry<Integer, Integer> entrada : cantidades.entrySet()) {
            Integer idVariante = entrada.getKey();
            Integer cantidad = entrada.getValue();

            VarianteModel variante = varianteRepository.findById(idVariante)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró la variante"
                ));

            if (variante.getIdProducto() == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La variante no tiene un producto asociado"
                );
            }

            ProductoModel producto = productoRepository.findById(variante.getIdProducto())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró el producto"
                ));

            if (producto.getPrecio() == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El producto no tiene precio registrado"
                );
            }

            int filas = varianteRepository.descontarStock(idVariante, cantidad);
            if (filas != 1) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El stock disponible es insuficiente"
                );
            }

            BigDecimal precioUnitario = producto.getPrecio();
            precios.put(idVariante, precioUnitario);
            subtotal = subtotal.add(precioUnitario.multiply(BigDecimal.valueOf(cantidad)));
        }

        BigDecimal costoEnvio = COSTO_ENVIO;
        BigDecimal total = subtotal.add(costoEnvio);

        DireccionModel direccion = new DireccionModel();
        direccion.setIdUsuario(request.idUsuario());
        direccion.setCiudad(request.ciudad().trim());
        direccion.setDireccion(request.direccion().trim());
        direccion.setCodigoPostal(null);
        DireccionModel direccionGuardada = direccionRepository.save(direccion);

        PedidoModel pedido = new PedidoModel();
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado(ESTADO_INICIAL);
        pedido.setCostoEnvio(costoEnvio);
        pedido.setSubtotal(subtotal);
        pedido.setTotal(total);
        pedido.setIdUsuario(request.idUsuario());
        pedido.setIdDireccion(direccionGuardada.getIdDireccion());
        PedidoModel pedidoGuardado = pedidoRepository.save(pedido);

        for (Map.Entry<Integer, Integer> entrada : cantidades.entrySet()) {
            DetallePedidoModel detalle = new DetallePedidoModel();
            detalle.setIdPedido(pedidoGuardado.getIdPedido());
            detalle.setIdVariante(entrada.getKey());
            detalle.setCantidad(entrada.getValue());
            detalle.setPrecioUnitario(precios.get(entrada.getKey()));
            detallePedidoRepository.save(detalle);
        }

        PagoModel pago = new PagoModel();
        pago.setIdPedido(pedidoGuardado.getIdPedido());
        pago.setMedio(medio);
        pago.setValor(total.setScale(0, RoundingMode.HALF_UP));
        pago.setFechaPago(LocalDateTime.now());
        PagoModel pagoGuardado = pagoRepository.save(pago);

        return new CheckoutResponse(
            pedidoGuardado.getIdPedido(),
            pagoGuardado.getIdPago(),
            direccionGuardada.getIdDireccion(),
            subtotal,
            costoEnvio,
            total,
            ESTADO_INICIAL,
            medio
        );
    }

    private void validar(CheckoutRequest request) {
        if (request == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los datos del checkout son obligatorios"
            );
        }

        if (request.idUsuario() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El ID del usuario es obligatorio"
            );
        }

        usuarioRepository.findById(request.idUsuario())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró el usuario"
            ));

        if (request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Los items del pedido son obligatorios"
            );
        }

        for (CheckoutItemRequest item : request.items()) {
            if (item == null || item.idVariante() == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El ID de la variante es obligatorio"
                );
            }

            if (item.cantidad() == null || item.cantidad() <= 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La cantidad debe ser mayor a cero"
                );
            }
        }

        if (request.direccion() == null || request.direccion().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La dirección es obligatoria"
            );
        }

        if (request.ciudad() == null || request.ciudad().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La ciudad es obligatoria"
            );
        }

        if (request.medio() == null || request.medio().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El medio de pago es obligatorio"
            );
        }

        String medio = request.medio().trim().toUpperCase();
        if (!"TC".equals(medio) && !"TB".equals(medio)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "El medio de pago debe ser TC o TB"
            );
        }
    }
}
