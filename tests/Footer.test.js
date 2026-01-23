import Footer from '../pages/Footer.js';

import { render } from '@testing-library/react';

describe('Footer', () => {
  it('should render footer text', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('© 2024 Base Fixed NFT MiniApp')).toBeInTheDocument();
  });
});
