{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    systems.url = "github:nix-systems/default";
    node-addon-api = {
      url = "github:nodejs/node-addon-api/v8.3.1";
      flake = false;
    };
    node-api-headers = {
      url = "github:nodejs/node-api-headers/v1.5.0";
      flake = false;
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      systems,
      node-addon-api,
      node-api-headers,
    }:
    let
      eachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = eachSystem (
        system:
        let
          pkgs = (
            import nixpkgs {
              inherit system;
              overlays = [
                (final: prev: {
                  llvmPackages = final.llvmPackages_git;
                })
              ];

              crossSystem = {
                inherit system;

                useLLVM = true;
                linker = "lld";
              };
            }
          );
        in
        with pkgs;
        {
          node-opus = clangStdenv.mkDerivation {
            name = "node-opus";
            src = ./.;

            buildInputs = [
              (libopus.overrideAttrs (old: {
                mesonFlags = old.mesonFlags ++ [ "-Ddefault_library=static" ];
              }))
            ];

            nativeBuildInputs = [
              buildPackages.meson
              buildPackages.ninja
              buildPackages.bun
              buildPackages.pkgconf
            ];

            phases = [
              "unpackPhase"
              "patchPhase"
              "buildPhase"
              "checkPhase"
            ];

            buildPhase = ''
              rm -rf subprojects/{node-addon-api-*,node-api-headers-*,opus-*} || true
              mkdir -p subprojects/{node-addon-api-8.3.1,node-api-headers-1.5.0}
              cp -r ${node-addon-api}/* subprojects/node-addon-api-8.3.1/
              cp -r ${node-api-headers}/* subprojects/node-api-headers-1.5.0/
              meson subprojects packagefiles --apply
              rm -rf build || true
              bun run build
            '';

            doCheck = true;
            checkPhase = ''
              bun run test
            '';
          };

        }
      );
    };
}
