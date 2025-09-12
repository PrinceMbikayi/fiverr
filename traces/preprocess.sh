sed -i '' 's/\s*at/at/g' $1
sed -i '' 's/(/ (/g' $1
sed -i '' 's/:0:/:1:/g' $1 # Stack beautifier indexes lines from 1 and not 0