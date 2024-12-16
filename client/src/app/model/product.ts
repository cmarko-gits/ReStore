export interface Product {
    id: number
    name: string
    description: string
    pictureUrl: string
    type?: string
    brand: string
    price: number
    quantityInStock?: number
  }
  

  export interface ProductParams {
    orderBy : string ;
    searchTerm? : string ;
    types : string[]
    brands : string[]
    pageNumber : number 
    pageSize : number
  }