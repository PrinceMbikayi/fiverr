Sous ANDROID

Si la modal contient un input et que le focus est appliqué
Le clavier s'ouvre et il y a un clignotement du backdrop
c'est normal car il y a un animation dans le composant concernant la taille du bouton

Fix rapide : 
- dans le fichier node_modules/@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/BottomSheetBackdrop.tsx

dans le rendu =>   <AnimatedTouchableWithoutFeedback> renplacer style={buttonStyle} par style={style}

TODO :
placer ce fix via un post install
