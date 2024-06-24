import React from "react";
import { createRoot } from 'react-dom/client';
import { Button } from "./components";

import './utils'

const container = document.getElementById('app-container');
const root = createRoot(container);
root.render(<Button onClick={()=>{alert('auok?')}} name="click me!"></Button>);

