export interface UserInterface {
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
  company: string;
  avatar: string;
  [key: string]: any;
}

export interface UserTaskInterface {
  id: number;
  title: string;
  completed: boolean;
}
