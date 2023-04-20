import { ReactNode } from "react";

interface Props {
    children: ReactNode;
};

export default function Content({ children }: Props) {
    return (
        <div className="min-w-full lg:px-96 md:px-48 sm:px-8">
            <section className="mx-auto">
                {children}
            </section>
        </div>
    );
}