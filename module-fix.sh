#!/bin/sh
rm -R ./Content/Datas/Scripts/System/Libs
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/export \* from "(.+)"/export \* from "\1\.js"/g'
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/export \* as (.+) from "(.+)"/export \* as \1 from "\.\/\1\/index\.js"/g'
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/import (\{ .+ \}|\* as .+) from "(\.\.?\/)(.+)"/import \1 from "\2\3\.js"/g'
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/import (\{ .+ \}|\* as .+) from "(\.\.?\/)(Graphic|Core|Datas|EventCommand|Manager|Scene|Common|System|Libs|Utils).js"/import \1 from "\2\3\/index\.js"/g'
find ./Content/Datas/Scripts/System \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i -E 's/import (\{ .+ \}|\* as .+) from "(\.\.?)"/import \1 from "\2\/index\.js"/g'
cp -R ./src/Libs ./Content/Datas/Scripts/System/Libs