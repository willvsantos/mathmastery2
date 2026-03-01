# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_22
    pkgs.jdk17
    pkgs.android-tools
  ];

  # Sets environment variables in the workspace
  env = {
    # Necessário para o Gradle achar o Java ao compilar o Android
    JAVA_HOME = "${pkgs.jdk17}/lib/openjdk";
    # Opcional, caso o SDK do Android não seja detectado automaticamente pelo Capacitor
    # ANDROID_HOME = "...";
  };
  
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "esbenp.prettier-vscode"
      "bradlc.vscode-tailwindcss"
      "dsznajder.es7-react-js-snippets"
    ];
    
    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          # Example: run "npm run dev" with PORT set to IDX's predefined port for previews,
          # and show it in IDX's web preview panel
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
    
    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        npm-install = "npm install";
      };
    };
  };
}
