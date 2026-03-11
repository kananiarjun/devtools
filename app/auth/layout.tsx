// This layout suppresses the global Navbar and footer for all auth pages.
// Children are rendered full-screen with no extra wrappers.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
