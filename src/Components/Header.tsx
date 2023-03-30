import Button from "./Button";

export default function Header() {
    return (
        <header className="min-w-full flex justify-between border-b-2 mb-5 dark:border-darken items-center py-3">
            <h1 className="text-2xl font-bold">
                Word Wise
            </h1>

            <Button>Sign in</Button>
        </header>
    );
}