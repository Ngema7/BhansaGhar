import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <section className="paper py-28 text-center">
      <div className="container-x">
        <p className="font-deva text-2xl text-brick">पृष्ठ फेला परेन</p>
        <h1 data-hero-title className="mt-2 text-5xl font-semibold text-maroon">Page not found</h1>
        <p className="mt-3 text-brown/75">The page you're looking for doesn't exist or has moved.</p>
        <Button to="/" className="mt-7">Back to Home</Button>
      </div>
    </section>
  );
}
