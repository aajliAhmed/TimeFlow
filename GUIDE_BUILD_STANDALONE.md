# Guide de Build Standalone - TimeFlow

Ce guide vous explique comment créer une application standalone (APK) que vous pouvez installer directement sur votre téléphone Android **sans Expo Go** et **sans connexion internet**.

## 📋 Prérequis

1. **Un compte Expo** (gratuit) : https://expo.dev/signup
2. **EAS CLI** installé globalement
3. **Node.js** et **npm** installés

## 🚀 Étapes pour créer le build

### 1. Installer EAS CLI

```bash
npm install -g eas-cli
```

### 2. Se connecter à votre compte Expo

```bash
eas login
```

Suivez les instructions pour vous connecter avec votre compte Expo (ou créez-en un si nécessaire).

### 3. Configurer le projet EAS

```bash
eas build:configure
```

Cette commande va créer le fichier `eas.json` si nécessaire (déjà créé pour vous).

### 4. Créer le build Android (APK)

Pour créer un APK que vous pouvez installer directement :

```bash
npm run build:android
```

Ou directement :

```bash
eas build --platform android --profile preview
```

### 5. Suivre le processus de build

- Le build va s'exécuter sur les serveurs d'Expo (cloud build)
- Vous verrez une URL dans le terminal pour suivre la progression
- Le build prend environ 10-15 minutes

### 6. Télécharger l'APK

Une fois le build terminé :

1. Connectez-vous à https://expo.dev/accounts/[votre-compte]/projects/timeflow/builds
2. Trouvez votre build terminé
3. Cliquez sur "Download" pour télécharger l'APK

## 📱 Installation sur votre téléphone

### Méthode 1 : Via USB

1. Transférez l'APK sur votre téléphone via USB
2. Sur votre téléphone, allez dans **Paramètres** → **Sécurité** → Activez **"Sources inconnues"**
3. Ouvrez le fichier APK avec un gestionnaire de fichiers
4. Suivez les instructions d'installation

### Méthode 2 : Via QR Code

1. Une fois le build terminé, Expo vous donnera un QR code
2. Scannez-le avec votre téléphone
3. Téléchargez et installez l'APK directement

## 🔧 Options avancées

### Build de production (AAB pour Google Play)

Si vous voulez publier sur Google Play Store :

```bash
npm run build:android:prod
```

Cela créera un AAB (Android App Bundle) au lieu d'un APK.

### Build local (plus rapide, nécessite Android Studio)

Si vous voulez créer le build localement (plus rapide mais nécessite Android Studio) :

```bash
eas build --platform android --profile preview --local
```

## ⚠️ Notes importantes

1. **Premier build** : Le premier build peut prendre plus de temps (15-20 min)
2. **Builds suivants** : Les builds suivants sont plus rapides (5-10 min)
3. **Gratuit** : Les builds avec EAS sont gratuits jusqu'à un certain nombre par mois
4. **Sans connexion** : Une fois installé, l'application fonctionne complètement **sans connexion internet**

## 🎉 Résultat

Une fois installée, vous aurez :

- ✅ Application TimeFlow fonctionnant **sans Expo Go**
- ✅ Fonctionne **sans connexion internet**
- ✅ Installation directe sur votre téléphone
- ✅ Toutes les fonctionnalités de TimeFlow incluse

## 🆘 Dépannage

### Erreur "eas: command not found"

Installez EAS CLI :
```bash
npm install -g eas-cli
```

### Erreur "Not logged in"

Connectez-vous :
```bash
eas login
```

### Le build échoue

Vérifiez que :
- Vous êtes connecté à votre compte Expo
- Toutes les dépendances sont installées (`npm install`)
- La configuration dans `app.json` est correcte

## 📝 Configuration actuelle

- **Package Name** : `com.timeflow.app`
- **Version** : `1.0.0`
- **Build Type** : APK (pour installation directe)

---

**Bon build ! 🚀**

