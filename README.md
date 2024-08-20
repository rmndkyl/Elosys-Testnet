# Tutorial: Cara Menjalankan Script untuk Elosys-Deploy-Contract dan Elosys-Auto-Transfer
 - Panduan ini akan membantu kamu dalam menyiapkan dan menjalankan script dari proyek `Elosys-Deploy-Contract` dan `Elosys-Auto-Transfer`.
 - Instruksi ini cocok untuk pemula yang sudah memiliki pengetahuan dasar dalam menggunakan command line dan sudah menginstal Node.js di Windows/Linux kalian.

# Requirements
 - **Node.js**: Pastikan Node.js dan npm (Node Package Manager) sudah terinstal di sistem kamu. Kamu bisa mendownloadnya dari [nodejs.org](https://nodejs.org/en/download/prebuilt-installer).
 - Git (opsional): Jika kamu ingin mengkloning repositori dari GitHub, kamu perlu menginstal Git. Download dari [Git Official Website](https://git-scm.com).

# SETUP
```bash
git clone https://github.com/rmndkyl/Elosys-Testnet.git && cd Elosys-Testnet
```

## Langkah 1: Menyiapkan Script Deploy Contract
Masuk ke direktori proyek:
Buka terminal dan masuk ke folder Elosys-Deploy-Contract/evm-contract-deployer-main.
```bash
cd Elosys-Deploy-Contract
```

### Instalasi Dependencies:
Jalankan perintah berikut untuk menginstal semua dependencies yang diperlukan, sesuai dengan yang tercantum di file package.json.
```bash
npm install
```

### Perbarui Private Keys:
Buka file `privateKeys.json`.
Tambahkan private key kamu ke file ini. Pastikan formatnya sesuai dengan yang diharapkan oleh script.

## Deploy Kontrak:
Gunakan perintah berikut untuk melakukan deploy kontrak menggunakan Hardhat:
```bash
npm run deploy
```

# Langkah 2: Menyiapkan Script Auto Transfer
Masuk ke direktori proyek:
Buka terminal dan masuk ke folder Elosys-Auto-Transfer/Elosys-Auto-Transfer.
```bash
cd Elosys-Auto-Transfer
```
## Instalasi Dependencies:
Jalankan perintah berikut untuk menginstal semua dependencies yang diperlukan sesuai dengan yang tercantum di file package.json.
```bash
npm install
npm install readline-sync chalk fs ethers
```

### Perbarui Private Keys:
Buka file `privateKeys.json`.
Tambahkan private key kamu ke file ini. Pastikan formatnya sesuai dengan yang diharapkan oleh script.

### Buka file addresses.txt.
Tambahkan alamat Ethereum yang ingin kamu kirimi dana, satu alamat per baris.
Format Address:
```bash
0x000
0xabc
0xblablabla
```

## Jalankan Script Auto-Transfer:
Jalankan perintah berikut untuk memulai proses transfer otomatis:
```bash
node index.js
```

# Pemecahan Masalah
- Dependencies Hilang: Jika kamu menemukan dependencies yang hilang, pastikan dependencies tersebut tercantum di file `package.json` dan jalankan npm install lagi.
- Variabel Lingkungan: Periksa kembali file `.env` untuk memastikan semua variabel yang diperlukan sudah diatur dengan benar.
- Private Keys: Pastikan private key kamu sudah diformat dengan benar di file `privateKeys.json`.

# Credited by: Layer Airdrop
 - [Telegram Channel](https://t.me/layerairdrop)
 - [Telegram Group](https://t.me/layerairdropdiskusi)
