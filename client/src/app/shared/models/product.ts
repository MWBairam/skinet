interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    pictureUrl: string;
    productType: string;
    productBrand: string;
  }

  //typescript interfaces do not require the "I" as a prefix before the interface name, but it is better to keep the conventions
  //the "export" is written before the interface to allow us to use the interface from any other file 