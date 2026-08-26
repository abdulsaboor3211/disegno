/**
 * Google Analytics / Meta Pixel tracking events
 * 
 * These events are used for tracking user behavior and conversions.
 * Events are sent to both Google Analytics and Meta Pixel if configured.
 */

// Track event function
export function trackEvent(eventName, eventData = {}) {
    // Google Analytics (gtag)
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventData);
    }

    // Meta Pixel (fbq) - Use trackCustom for non-standard events
    if (typeof window !== 'undefined' && window.fbq) {
        // Standard Meta Pixel events: 'AddToCart', 'Purchase', 'InitiateCheckout'
        // Non-standard events like 'order_now' should use trackCustom
        const standardEvents = ['AddToCart', 'Purchase', 'InitiateCheckout', 'Lead', 'CompleteRegistration'];

        // Convert event name to Meta Pixel naming convention
        let metaEventName = eventName;
        if (eventName === 'add_to_cart') metaEventName = 'AddToCart';
        else if (eventName === 'checkout') metaEventName = 'Purchase';
        else if (eventName === 'order_now') metaEventName = 'order_now'; // Keep as-is for trackCustom

        // Use trackCustom for non-standard events
        if (standardEvents.includes(metaEventName)) {
            window.fbq('track', metaEventName, eventData);
        } else {
            window.fbq('trackCustom', metaEventName, eventData);
        }
    }

    // Console log for debugging in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Event: ${eventName}`, eventData);
    }
}

// Add to Cart event
export function trackAddToCart(product, quantity = 1, variant = null) {
    trackEvent('add_to_cart', {
        content_ids: [product.sku],
        content_name: product.productName,
        content_category: product.category || 'General',
        content_type: 'product',
        quantity: quantity,
        price: product.discountPrice || product.productPrice,
        currency: 'PKR',
        value: (product.discountPrice || product.productPrice) * quantity,
        ...(variant && { variant: variant }),
    });
}

// Order Now / Buy Now event
export function trackOrderNow(product, quantity = 1, variant = null) {
    trackEvent('order_now', {
        content_ids: [product.sku],
        content_name: product.productName,
        content_category: product.category || 'General',
        content_type: 'product',
        quantity: quantity,
        price: product.discountPrice || product.productPrice,
        currency: 'PKR',
        value: (product.discountPrice || product.productPrice) * quantity,
        ...(variant && { variant: variant }),
    });
}

// Checkout / Order Complete event
export function trackCheckout(orderItems, orderTotal, orderId = null) {
    // Prepare contents array for Meta Pixel
    const contents = orderItems.map((item) => ({
        id: item.productSku || item.sku,
        quantity: item.quantity,
        item_price: item.unitPrice,
    }));

    trackEvent('checkout', {
        order_id: orderId || 'pending',
        value: orderTotal,
        currency: 'PKR',
        contents: contents,
        content_type: 'product',
        num_items: orderItems.length,
        // Add individual items for Google Analytics
        items: orderItems.map((item) => ({
            item_id: item.productSku || item.sku,
            item_name: item.productName,
            quantity: item.quantity,
            price: item.unitPrice,
        })),
    });
}

// Initiate Checkout event (when user clicks "Proceed to Checkout")
export function trackInitiateCheckout(cartItems, cartTotal) {
    const contents = cartItems.map((item) => ({
        id: item.sku,
        quantity: item.quantity,
        item_price: item.unitPrice,
    }));

    trackEvent('initiate_checkout', {
        value: cartTotal,
        currency: 'PKR',
        contents: contents,
        content_type: 'product',
        num_items: cartItems.length,
    });
}