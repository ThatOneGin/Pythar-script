echo "Initializing installation"

#directory of the executable
INSTALL_DIR="/usr/local/bin"

#compile to executable
deno compile -A psc.ts

sudo mv psc "$INSTALL_DIR"

#install the standard library
sudo luarocks --lua-version=5.4 make pytharscript-dev-1.rockspec

#do permissions of executable to build.sh
chmod +x "$INSTALL_DIR/psc"

if [ -f "$INSTALL_DIR/psc" ]; then
    echo "Installation done."
else
    echo "Error during installation."
fi