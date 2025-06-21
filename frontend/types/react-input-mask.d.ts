declare module 'react-input-mask' {
  import * as React from 'react';

  interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    alwaysShowMask?: boolean;
    maskChar?: string | null;
    formatChars?: { [key: string]: string };
    beforeMaskedStateChange?: (states: {
      currentState: any;
      nextState: any;
      previousState: any;
    }) => any;
  }

  const InputMask: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLInputElement>>;
  export default InputMask;
}
