import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AsyncComponent from './AsyncComponent';

test('loads and displays data', async () => {
  render(<AsyncComponent />);
  
  userEvent.click(screen.getByText('Load Data'));

  // Wait for the asynchronous action to complete
  await waitFor(() => expect(screen.getByText('Data Loaded')).toBeInTheDocument());
});


import { render, screen, waitfor} from "@testing-library/react";


test("loading and display data" async ()=>{
    render(<AsyncComponent />);
    userEvent.click(screen.getByText("Load Data"))

    await waitFor(()=> expect(screen.getByText("Data Loaded").toBeInTheDocument()))
})