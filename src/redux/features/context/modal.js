import { createContext } from 'react';

// Up top, we create a new context
// This is an object with 2 properties: { Provider, Consumer }
// Note that it's named with UpperCase, not camelCase
// This is important because we'll use it as a component later
// and Component Names must start with a Capital Letter

const ModalContext = createContext();

export default ModalContext;
