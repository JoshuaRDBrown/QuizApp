import { useState } from 'react';

export const useInput = value => {
  const [val, setVal] = useState(value);

  return {
    val,
    setVal,
    bind: {
      val,
      onChange: event => {
        setVal(event.target.value);
      }
    }
  };
};
