import { NewClientForm } from "../_components/new-client-form";

export const metadata = { title: "Nueva ficha · Panel AMPLIKAA" };

export default function NuevoClientePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <NewClientForm />
    </div>
  );
}
