Cada vez que hagas cambios, solo necesitas ejecutar:

bash
npm run build
npx netlify-cli deploy --dir=dist --prod


$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); npm run dev