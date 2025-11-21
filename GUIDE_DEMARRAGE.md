# Guide de Démarrage - TimeFlow sur Expo Go

## 🚀 Étapes pour démarrer l'application sur Expo Go

### 1. Vérifier que tout est installé

Dans le terminal, vérifiez que les dépendances sont installées :

```bash
npm install
```

### 2. Vider le cache et redémarrer

Arrêtez le serveur actuel (si lancé) avec `Ctrl+C`, puis :

```bash
npx expo start --clear
```

La commande `--clear` vide le cache Metro qui peut causer des erreurs.

### 3. Connecter votre téléphone

**Option A : Via QR Code (recommandé)**
- Ouvrez Expo Go sur votre téléphone
- Scannez le QR code affiché dans le terminal
- Assurez-vous que votre téléphone et votre ordinateur sont sur le **même réseau Wi-Fi**

**Option B : Via adresse IP**
- Si le QR code ne fonctionne pas, dans Expo Go :
  - Tapez manuellement : `exp://[VOTRE_IP]:8081`
  - Remplacez `[VOTRE_IP]` par l'adresse IP locale de votre ordinateur

### 4. Si l'erreur "Failed to download remote update" persiste

**Solution 1 : Vérifier la connexion réseau**
```bash
# Assurez-vous que le téléphone et l'ordinateur sont sur le même réseau Wi-Fi
# Désactivez temporairement le pare-feu Windows si nécessaire
```

**Solution 2 : Utiliser Tunnel**
```bash
npx expo start --tunnel
```
⚠️ Plus lent mais fonctionne même si vous n'êtes pas sur le même réseau.

**Solution 3 : Réinstaller les dépendances**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

**Solution 4 : Tester dans le navigateur web**
Dans le terminal Expo, appuyez sur `w` pour tester dans le navigateur et vérifier si le code fonctionne.

### 5. Vérifier les logs d'erreur

Si l'application ne démarre toujours pas :
- Dans Expo Go, appuyez sur "View error log"
- Dans le terminal Expo, vérifiez les messages d'erreur
- Partagez les erreurs pour obtenir de l'aide

## 📱 Commandes utiles dans Expo

Une fois que le serveur est lancé :
- `r` : Recharger l'application
- `j` : Ouvrir le débogueur
- `m` : Afficher le menu développeur
- `w` : Ouvrir dans le navigateur web
- `a` : Ouvrir sur émulateur Android
- `i` : Ouvrir sur simulateur iOS
- `Ctrl+C` : Arrêter le serveur

## 🔧 Problèmes courants

### "Unable to resolve module"
```bash
npm install
npx expo start --clear
```

### "Network request failed"
- Vérifiez que votre téléphone et ordinateur sont sur le même Wi-Fi
- Utilisez `--tunnel` : `npx expo start --tunnel`

### "Expo Go version incompatible"
- Mettez à jour Expo Go depuis le Play Store / App Store
- Ou mettez à jour Expo : `npm install expo@latest`

### Port 8081 déjà utilisé
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID [PID_NUMBER] /F

# Puis redémarrez
npx expo start --clear
```

## ✅ Ce que vous devriez voir

Quand tout fonctionne :
- Un fond sombre (#0A0A0A)
- Le titre "TimeFlow" en haut
- Deux jauges circulaires (demi-cercles) :
  - Cyan pour le matin (09:00 - 13:00)
  - Orange pour l'après-midi (14:00 - 18:00)
- Le temps restant au format HH:MM:SS au centre de chaque jauge
- Les aiguilles qui bougent selon l'heure actuelle

## 🆘 Besoin d'aide ?

Si l'application ne démarre toujours pas :
1. Partagez les erreurs du terminal
2. Partagez les erreurs d'Expo Go ("View error log")
3. Vérifiez que vous utilisez la dernière version d'Expo Go

