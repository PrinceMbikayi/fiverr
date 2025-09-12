// objects type Mapping may be completed getting distant json
// look at _Api/config => getConfigFromServer
// if the json file is not reachable
// distantConfig.json is used as fallback
// it may be also be useful as an example for distant file


//=========================================
Pairing (_brand/config/brandProducts.js)
- it read productsPairing.json
- it can merge with other brand products (i.e. AtHome)



//==========================================
Products (src/config/products/athome.js)
- see readme in src/config/products for distant config if exists
===========================================
Header Buttons ("./products.json" et "src/config/products/athomeProducts.json")
le fichier de la brand doit exister peut être un objet vide et son contenu s'ajoute au fichier de base
et les valeurs du fichier dans brand remplace celle de base pour une même clef
============================================
Categories (categories.json)
{
  "devices" : [ "QR-BASIC","DOORKEEPER"],
  "tileColor" : "additional_2_lighter",
  "icon" : "notification",
  "iconColor" : "#70A896"
}

//=========================================
Widgets / Tiles (src/components/objects/@dynamics/widgets)

//=========================================
Details (brand/templates/objects/@dynamic_brand/details et src/components/objects/@dynamics/details)

//=========================================
Settings (_brand/navigation/productSettings)

//=========================================

ADD PRODUCT WIZARDS available for brand product
(look at _brand/templates/screens/productsRelated/addProduct/config.js)


