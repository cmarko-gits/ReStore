export interface Basket {
    id: number
    buyerId: string
    items: BasketItem[]
  }
  
  export interface BasketItem{
    id: number
    name: string
    pictureUrl: string
    type: string
    brand: string
    price: number
    quantity: number
  }
  