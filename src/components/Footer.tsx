export default function Footer() {
    return (
        <footer className=" bg-velodeep text-velobone py-8">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="text-sm opacity-80">
                    © {new Date().getFullYear()} VeloRent. Все права защищены.
                </p>
            </div>
        </footer>
    );
}
