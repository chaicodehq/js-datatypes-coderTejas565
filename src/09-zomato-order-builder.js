/**
 * 🍕 Zomato Order Builder
 *
 * Zomato jaisa order summary banana hai! Cart mein items hain (with quantity
 * aur addons), ek optional coupon code hai, aur tujhe final bill banana hai
 * with itemwise breakdown, taxes, delivery fee, aur discount.
 *
 * Rules:
 *   - cart is array of items:
 *     [{ name: "Butter Chicken", price: 350, qty: 2, addons: ["Extra Butter:50", "Naan:40"] }, ...]
 *   - Each addon string format: "AddonName:Price" (split by ":" to get price)
 *   - Per item total = (price + sum of addon prices) * qty
 *   - Calculate:
 *     - items: array of { name, qty, basePrice, addonTotal, itemTotal }
 *     - subtotal: sum of all itemTotals
 *     - deliveryFee: Rs 30 if subtotal < 500, Rs 15 if 500-999, FREE (0) if >= 1000
 *     - gst: 5% of subtotal, rounded to 2 decimal places parseFloat(val.toFixed(2))
 *     - discount: based on coupon (see below)
 *     - grandTotal: subtotal + deliveryFee + gst - discount (minimum 0, use Math.max)
 *     - Round grandTotal to 2 decimal places
 *
 *   Coupon codes (case-insensitive):
 *     - "FIRST50"  => 50% off subtotal, max Rs 150 (use Math.min)
 *     - "FLAT100"  => flat Rs 100 off
 *     - "FREESHIP" => delivery fee becomes 0 (discount = original delivery fee value)
 *     - null/undefined/invalid string => no discount (0)
 *
 *   - Items with qty <= 0 ko skip karo
 *   - Hint: Use map(), reduce(), filter(), split(), parseFloat(),
 *     toFixed(), Math.max(), Math.min(), toLowerCase()
 *
 * Validation:
 *   - Agar cart array nahi hai ya empty hai, return null
 *
 * @param {Array<{ name: string, price: number, qty: number, addons?: string[] }>} cart
 * @param {string} [coupon] - Optional coupon code
 * @returns {{ items: Array<{ name: string, qty: number, basePrice: number, addonTotal: number, itemTotal: number }>, subtotal: number, deliveryFee: number, gst: number, discount: number, grandTotal: number } | null}
 *
 * @example
 *   buildZomatoOrder([{ name: "Biryani", price: 300, qty: 1, addons: ["Raita:30"] }], "FLAT100")
 *   // subtotal: 330, deliveryFee: 30, gst: 16.5, discount: 100
 *   // grandTotal: 330 + 30 + 16.5 - 100 = 276.5
 *
 *   buildZomatoOrder([{ name: "Pizza", price: 500, qty: 2, addons: [] }], "FIRST50")
 *   // subtotal: 1000, deliveryFee: 0, gst: 50, discount: min(500, 150) = 150
 *   // grandTotal: 1000 + 0 + 50 - 150 = 900
 */
export function buildZomatoOrder(cart, coupon) {
  if (!Array.isArray(cart) || cart.length === 0) {
    return null
  }

  const validItems = cart.filter(item => item.qty > 0)

  const items = validItems.map(item => {
    let addonTotal = 0
    if (item.addons) {
      item.addons.forEach(addon => {
        const parts = addon.split(":")  
        addonTotal += parseFloat(parts[1])
      })
    }

  const itemTotal = (item.price + addonTotal) * item.qty

    return {
      name: item.name,
      qty: item.qty,
      basePrice: item.price,
      addonTotal: addonTotal,
      itemTotal: itemTotal
    }
  })

  let subtotal = 0
  items.forEach(item => {
    subtotal += item.itemTotal
  })

  let deliveryFee = 0
  if (subtotal < 500){ 
    deliveryFee = 30
  }
  else if (subtotal < 1000){
    deliveryFee = 15
  }

  let gst = subtotal * 0.05
  gst = parseFloat(gst.toFixed(2))

  let discount = 0
  const code = typeof coupon === "string" ? coupon.toLowerCase() : ""

  if (code === "first50") {
    discount = Math.min(subtotal * 0.5, 150)
  } 
  else if (code === "flat100") {
    discount = 100
  } 
  else if (code === "freeship") {
    discount = deliveryFee
    deliveryFee = 0
  }

  let grandTotal = subtotal + deliveryFee + gst - discount
  grandTotal = Math.max(0, grandTotal)
  grandTotal = parseFloat(grandTotal.toFixed(2))

  return {
    items,
    subtotal,
    deliveryFee,
    gst,
    discount,
    grandTotal
  }
}