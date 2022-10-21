@echo off

:: A name to prefix any messages to avoid confusion if there are multiple open.
set prefix=[exterra]

:: Create the SCSS folder if it doesn't exist.
if not exist "../scss" (
    mkdir "../scss"
    echo %prefix% Created SCSS folder.
)

:: Create the CSS folder if it doesn't exist.
if not exist "../css" (
    mkdir "../css"
    echo %prefix% Created CSS folder.
)

:: Start watching for changes in the SCSS folder and convert to the CSS folder.
echo %prefix% Converting from the "scss" folder to the "css" folder.
sass --watch --no-source-map ../scss:../css
