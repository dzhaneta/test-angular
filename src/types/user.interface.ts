export interface UserInterface {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  phone: string;
  website: string;
  company: string;
  [key: string]: any;
}

export interface FetchedUserInterface {
  id: number;
  name: string;
  username: string;
  email: string;
  address:{
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    bs: string;
    catchPhrase: string;
    name: string;
  };
  [key: string]: any;
}
