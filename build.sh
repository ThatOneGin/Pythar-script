echo "Initializing installation"

INSTALL_DIR="/usr/local/bin"

deno compile psc.ts

mv psc "$INSTALL_DIR"

chmod +x "$INSTALL_DIR/psc"

if [ -f "$INSTALL_DIR/psc" ]; then
    echo "Installation done."
else
    echo "Error during installation."
fi