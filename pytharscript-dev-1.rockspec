package = "pytharscript-std"
version = "dev-1"
source = {
   url = "git+https://github.com/ThatOneGin/Pythar-script.git"
}
description = {
   summary = "* obs: the transpiler targets lua5.4.",
   detailed = "* obs: the transpiler targets lua5.4.",
   homepage = "https://github.com/ThatOneGin/Pythar-script",
   license = "MIT"
}
build = {
   type = "builtin",
   modules = {
      std = "lib/std.lua",
   }
}