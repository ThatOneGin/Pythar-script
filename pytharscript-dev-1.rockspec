package = "pytharscript"
version = "dev-1"
source = {
   url = "git+https://github.com/ThatOneGin/Pythar-script.git"
}
description = {
   summary = "Pytharscript standard library",
   detailed = "Pytharscript standard library",
   homepage = "https://github.com/ThatOneGin/Pythar-script",
   license = "MIT"
}
dependencies = {
   "lua >= 5.4"
}
build = {
   type = "builtin",
   modules = {
      std = "lib/std.lua",
   }
}