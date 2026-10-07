# Velvet Marketplace

Marketplace base para creadores virtuales construido con Laravel 13, Inertia y React 19 con TypeScript.

## Stack

- Laravel 12 y PHP 8.2+
- Inertia 2 para las respuestas de servidor y navegación SPA
- React 19, TypeScript y Vite 8
- CSS propio, responsive y sin dependencias visuales innecesarias

## Puesta en marcha

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate
npm install
composer run dev
```

La entrada está en `routes/web.php`; `MarketplaceController` entrega las props de Inertia y `resources/js/pages/Marketplace.tsx` contiene la experiencia inicial. La maqueta previa se conserva en `dist/` como referencia.

## Acceso para personas adultas

El dashboard está protegido por `age.verified`. Antes de entrar, la persona debe enviar fecha de nacimiento, país de residencia y una confirmación de mayoría de edad/términos. Laravel valida que tenga 18 años o más, limita los intentos y guarda únicamente el estado de verificación y el país en la sesión; no persiste la fecha de nacimiento.

Esta comprobación es una declaración de edad, no una verificación de identidad. Para cumplimiento regulatorio o jurisdicciones que lo exijan, integra un proveedor de verificación de edad/identidad antes de publicar la plataforma.

## Esquema MySQL

Las migraciones incluyen los módulos `creator_profiles`, `content_items`, `coin_packages`, `coin_orders`, `wallets`, `wallet_transactions`, `content_entitlements` y `age_verifications`. Los importes fiat se guardan como enteros en centavos y las monedas internas como enteros, evitando errores de precisión. Las transacciones y órdenes incluyen claves de idempotencia para que los webhooks de pago no acrediten saldo dos veces.

## Calidad

```powershell
npm run build
php artisan test
```

Antes de integrar pagos o contenido privado real, sustituye los datos de demostración por modelos Eloquent, aplica autorización por políticas y procesa cobros exclusivamente desde el servidor.
