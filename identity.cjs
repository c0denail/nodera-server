"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// apps/api/src/store.ts
var import_node_crypto4 = require("node:crypto");
var import_mongodb3 = require("mongodb");

// packages/shared/src/errors.ts
var HttpError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
  status;
};

// packages/shared/src/security.ts
var import_node_crypto = require("node:crypto");
var import_node_util = require("node:util");
var scrypt = (0, import_node_util.promisify)(import_node_crypto.scrypt);
async function hashPassword(password) {
  const salt = (0, import_node_crypto.randomBytes)(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}
async function verifyPassword(password, stored) {
  if (!/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(stored)) return false;
  const [salt, hash] = stored.split(":");
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && (0, import_node_crypto.timingSafeEqual)(actual, expected);
}
var tokenHash = (token) => (0, import_node_crypto.createHash)("sha256").update(token).digest("hex");
function credentials(body) {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Ge\xE7erli bir e-posta adresi girin.");
  if (password.length < 12 || password.length > 128)
    throw new Error("Parolan\u0131z 12\u2013128 karakter aras\u0131nda olmal\u0131.");
  return { email, password };
}

// apps/api/src/startup-errors.ts
var messages = {
  CONFIG_PORT: "PORT, 1 ile 65535 aras\u0131nda bir say\u0131 olmal\u0131.",
  CONFIG_SECRET: "AUTH_RATE_SECRET en az 32 karakter olmal\u0131.",
  CONFIG_URI: "API sunucusunun .env dosyas\u0131ndaki MONGODB_URI ba\u011Flant\u0131 adresini kontrol edin.",
  CONFIG_DATABASE: "MONGODB_DATABASE ge\xE7ersiz; yaln\u0131zca harf, rakam, alt \xE7izgi ve tire kullan\u0131n.",
  ATLAS_AUTH: "Atlas veritaban\u0131 kullan\u0131c\u0131s\u0131 veya parolas\u0131 kabul edilmedi. Database Access ayarlar\u0131n\u0131 kontrol edin.",
  ATLAS_PERMISSION: "Atlas kullan\u0131c\u0131s\u0131n\u0131n veritaban\u0131 ve indeks olu\u015Fturma yetkisi yetersiz. Database Access yetkilerini kontrol edin.",
  ATLAS_DNS: "Atlas adresi DNS \xFCzerinden \xE7\xF6z\xFCmlenemedi. \u0130nternet ba\u011Flant\u0131s\u0131n\u0131, DNS ve k\xFCme adresini kontrol edin.",
  ATLAS_TLS: "Atlas TLS ba\u011Flant\u0131s\u0131 kurulamad\u0131. \xD6nce Atlas Network Access listesinde g\xFCncel internet IP'nizin Active oldu\u011Funu kontrol edin; ard\u0131ndan VPN ve g\xFCvenlik duvar\u0131n\u0131 kontrol edin.",
  ATLAS_NETWORK: "Atlas'a ula\u015F\u0131lamad\u0131. K\xFCmenin \xE7al\u0131\u015Ft\u0131\u011F\u0131n\u0131, Network Access listesinde g\xFCncel internet IP'nizin Active oldu\u011Funu ve a\u011F eri\u015Fimini kontrol edin.",
  PORT_BUSY: "\xDCyelik API portu ba\u015Fka bir i\u015Flem taraf\u0131ndan kullan\u0131l\u0131yor. PORT ayar\u0131n\u0131 ve \xE7al\u0131\u015Fan \xFCyelik hizmetlerini kontrol edin.",
  LISTEN_ACCESS: "\xDCyelik API'si belirtilen HOST/PORT adresinde dinleyemiyor. Yerel a\u011F adresini ve port izinlerini kontrol edin.",
  UNKNOWN: "\xDCyelik hizmeti ba\u015Flat\u0131lamad\u0131. Sunucu yap\u0131land\u0131rmas\u0131n\u0131 ve Atlas ba\u011Flant\u0131s\u0131n\u0131 kontrol edin."
};
var IdentityStartupError = class extends Error {
  constructor(code) {
    super(messages[code]);
    this.code = code;
    this.name = "IdentityStartupError";
  }
  code;
};
function identityStartupFailure(error) {
  const codes = /* @__PURE__ */ new Set();
  const names = /* @__PURE__ */ new Set();
  const visited = /* @__PURE__ */ new Set();
  function visit(value, depth = 0) {
    if (!value || typeof value !== "object" || visited.has(value) || depth > 8)
      return;
    visited.add(value);
    const entry = value;
    codes.add(entry.code);
    names.add(entry.name);
    visit(entry.cause, depth + 1);
    visit(entry.error, depth + 1);
    visit(entry.reason, depth + 1);
    if (entry.servers instanceof Map)
      for (const server of entry.servers.values()) visit(server, depth + 1);
  }
  visit(error);
  let code = "UNKNOWN";
  if (error instanceof IdentityStartupError) code = error.code;
  else if (codes.has("EADDRINUSE")) code = "PORT_BUSY";
  else if (codes.has("EACCES") || codes.has("EADDRNOTAVAIL"))
    code = "LISTEN_ACCESS";
  else if (codes.has(18) || names.has("MongoMissingCredentialsError"))
    code = "ATLAS_AUTH";
  else if (codes.has(13)) code = "ATLAS_PERMISSION";
  else if (names.has("MongoParseError") || names.has("MongoInvalidArgumentError"))
    code = "CONFIG_URI";
  else if (["ENOTFOUND", "ENODATA", "EAI_AGAIN"].some((item) => codes.has(item)))
    code = "ATLAS_DNS";
  else if ([...codes].some(
    (item) => typeof item === "string" && /^ERR_(SSL|TLS)_/.test(item)
  ) || [
    "CERT_HAS_EXPIRED",
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "DEPTH_ZERO_SELF_SIGNED_CERT"
  ].some((item) => codes.has(item)))
    code = "ATLAS_TLS";
  else if (names.has("MongoServerSelectionError") || names.has("MongoNetworkError") || [
    "ETIMEDOUT",
    "ECONNREFUSED",
    "ECONNRESET",
    "ENETUNREACH",
    "EHOSTUNREACH"
  ].some((item) => codes.has(item)))
    code = "ATLAS_NETWORK";
  return `[NODERA_IDENTITY_${code}] ${messages[code]}`;
}

// apps/api/src/marketplace.ts
var import_node_crypto2 = require("node:crypto");
var import_mongodb = require("mongodb");
var uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
async function initializeMarketplace(db) {
  const listings = db.collection("rental_listings");
  await listings.createIndex(
    { ownerId: 1, deviceId: 1, machineId: 1 },
    { unique: true }
  );
  await listings.createIndex(
    { "lease.id": 1 },
    {
      unique: true,
      partialFilterExpression: { "lease.id": { $type: "string" } }
    }
  );
  await listings.createIndex(
    { "lease.guestId": 1 },
    {
      unique: true,
      partialFilterExpression: {
        "lease.phase": { $in: ["reserved", "active"] }
      }
    }
  );
  await listings.createIndex({ published: 1, updatedAt: -1 });
  await db.collection("rental_history").createIndex({ leaseId: 1 }, { unique: true });
}
var MarketplaceStore = class {
  constructor(db) {
    this.db = db;
    this.listings = db.collection("rental_listings");
  }
  db;
  listings;
  async publish(user, deviceId, body) {
    if (!uuid.test(deviceId) || typeof body.machineId !== "string" || !uuid.test(body.machineId))
      throw new HttpError(400, "Cihaz veya makine kimli\u011Fi ge\xE7ersiz.");
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (name.length < 2 || name.length > 48)
      throw new HttpError(400, "Makine ad\u0131 ge\xE7ersiz.");
    for (const [key2, min, max] of [
      ["cpu", 2, 256],
      ["memory", 4, 1024],
      ["storage", 64, 65536],
      ["network", 1, 1e3]
    ])
      if (!Number.isSafeInteger(body[key2]) || Number(body[key2]) < min || Number(body[key2]) > max)
        throw new HttpError(400, "Makine kaynaklar\u0131 ge\xE7ersiz.");
    const key = { ownerId: user.id, deviceId, machineId: body.machineId };
    const existing = await this.listings.findOne(key);
    if (existing?.lease || existing?.resetRequired)
      throw new HttpError(
        409,
        "\xD6nce mevcut oturumu sonland\u0131r\u0131p VM'yi temizleyin."
      );
    const value = {
      name,
      ownerName: user.name,
      cpu: Number(body.cpu),
      memory: Number(body.memory),
      storage: Number(body.storage),
      network: Number(body.network),
      ...typeof body.cpuModel === "string" && body.cpuModel.trim().length > 0 && body.cpuModel.length <= 200 && !/[\x00-\x1f\x7f]/.test(body.cpuModel) ? { cpuModel: body.cpuModel.trim() } : {},
      published: true,
      ...typeof body.directoryGeneration === "string" && uuid.test(body.directoryGeneration) ? { directoryGeneration: body.directoryGeneration, autoPublish: true } : {},
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (existing) {
      const result = await this.listings.findOneAndUpdate(
        { _id: existing._id, lease: null, resetRequired: false },
        { $set: value },
        { returnDocument: "after" }
      );
      if (!result)
        throw new HttpError(409, "Makinenin durumu de\u011Fi\u015Fti; yeniden deneyin.");
      return result;
    }
    const listing = {
      _id: (0, import_node_crypto2.randomUUID)(),
      ...key,
      ...value,
      resetRequired: false,
      lease: null
    };
    try {
      await this.listings.insertOne(listing);
    } catch (error) {
      if (error instanceof import_mongodb.MongoServerError && error.code === 11e3)
        throw new HttpError(409, "Bu makine zaten yay\u0131mlanm\u0131\u015F.");
      throw error;
    }
    return listing;
  }
  async reserve(user, id, durationMinutes) {
    const lease = {
      id: (0, import_node_crypto2.randomUUID)(),
      guestId: user.id,
      guestName: user.name,
      phase: "reserved",
      expiresAt: new Date(Date.now() + 12e4),
      ...durationMinutes ? { durationMinutes } : {}
    };
    try {
      const result = await this.listings.findOneAndUpdate(
        {
          _id: id,
          ownerId: { $ne: user.id },
          published: true,
          resetRequired: false,
          lease: null
        },
        { $set: { lease, updatedAt: /* @__PURE__ */ new Date() } },
        { returnDocument: "after" }
      );
      if (!result) throw new HttpError(409, "Makine art\u0131k m\xFCsait de\u011Fil.");
      return result;
    } catch (error) {
      if (error instanceof import_mongodb.MongoServerError && error.code === 11e3)
        throw new HttpError(
          409,
          "Zaten bir rezervasyonun veya a\xE7\u0131k oturumun var."
        );
      throw error;
    }
  }
  async forLease(id) {
    return this.listings.findOne({ "lease.id": id });
  }
  async end(listing) {
    if (!listing.lease) return;
    const result = await this.listings.findOneAndUpdate(
      { _id: listing._id, "lease.id": listing.lease.id },
      {
        $set: {
          published: false,
          resetRequired: true,
          "lease.phase": "resetting"
        }
      },
      { returnDocument: "after" }
    );
    if (result)
      await this.db.collection("rental_history").updateOne(
        { leaseId: listing.lease.id },
        {
          $setOnInsert: {
            leaseId: listing.lease.id,
            listingId: listing._id,
            ownerId: listing.ownerId,
            guestId: listing.lease.guestId,
            endedAt: /* @__PURE__ */ new Date()
          }
        },
        { upsert: true }
      );
  }
  async reset(ownerId, deviceId, id, leaseId, directoryGeneration, republish = false) {
    const result = await this.listings.updateOne(
      {
        _id: id,
        ownerId,
        deviceId,
        resetRequired: true,
        "lease.id": leaseId,
        "lease.phase": "resetting"
      },
      {
        $set: {
          lease: null,
          resetRequired: false,
          published: republish,
          ...directoryGeneration ? { directoryGeneration } : {},
          updatedAt: /* @__PURE__ */ new Date()
        }
      }
    );
    if (!result.matchedCount)
      throw new HttpError(409, "Temizlenecek oturum bulunamad\u0131.");
  }
  public(listing, online, participant = false) {
    return {
      id: listing._id,
      machineId: listing.machineId,
      ownerId: listing.ownerId,
      ownerName: listing.ownerName,
      name: listing.name,
      cpu: listing.cpu,
      memory: listing.memory,
      storage: listing.storage,
      network: listing.network,
      ...listing.cpuModel ? { cpuModel: listing.cpuModel } : {},
      ...listing.directoryGeneration ? { domainAccount: true } : {},
      published: listing.published,
      resetRequired: listing.resetRequired,
      online,
      available: online && listing.published && !listing.lease && !listing.resetRequired,
      lease: participant && listing.lease ? {
        ...listing.lease,
        expiresAt: listing.lease.expiresAt.toISOString()
      } : null
    };
  }
};

// apps/api/src/directory.ts
var import_node_crypto3 = require("node:crypto");
var import_mongodb2 = require("mongodb");

// packages/shared/src/directory.ts
function readWindowsAccountProfile(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Windows hesab\u0131 i\xE7in ad, soyad ve e-posta bilgilerini doldur.");
  const fields = value;
  const name = (key, label) => {
    const raw = fields[key];
    if (typeof raw !== "string" || /[\x00-\x1f\x7f]/.test(raw)) throw new Error(`${label} 1\u201364 karakter olmal\u0131.`);
    const result = raw.normalize("NFC").trim().replace(/ +/g, " ");
    if (!result || result.length > 64) throw new Error(`${label} 1\u201364 karakter olmal\u0131.`);
    return result;
  };
  const givenName = name("givenName", "Ad"), surname = name("surname", "Soyad");
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  if (email.length > 254 || /[\x00-\x1f\x7f]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Ge\xE7erli bir Windows hesab\u0131 e-posta adresi gir.");
  return { givenName, surname, email };
}
var directoryUuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
var windowsUsername = /^[a-z][a-z0-9_-]{2,19}$/;

// apps/api/src/directory.ts
function directoryOptions(env = process.env) {
  if (env.NODERA_DIRECTORY_ENABLED !== "true") return;
  const value = {
    enabled: true,
    domain: env.NODERA_AD_DOMAIN ?? "ad.nodera.test",
    netbios: env.NODERA_AD_NETBIOS ?? "NODERA",
    dnsServer: env.NODERA_AD_DNS ?? "100.90.52.46",
    computerOU: env.NODERA_AD_COMPUTER_OU ?? "OU=Computers,OU=Nodera,DC=ad,DC=nodera,DC=test",
    msiUrl: env.NODERA_TAILSCALE_MSI_URL ?? "",
    msiSha256: (env.NODERA_TAILSCALE_MSI_SHA256 ?? "").toLowerCase(),
    agentToken: env.NODERA_AD_AGENT_TOKEN ?? "",
    dataKey: env.NODERA_AD_DATA_KEY ?? ""
  };
  if (!/^[a-f0-9]{64}$/.test(value.dataKey) || !/^[a-f0-9]{64}$/.test(value.agentToken) || !/^[a-f0-9]{64}$/i.test(value.msiSha256) || !/^https:\/\/pkgs\.tailscale\.com\/stable\/tailscale-setup-[\d.]+-amd64\.msi$/.test(value.msiUrl) || !/^[a-z0-9.-]+$/.test(value.domain) || !/^[A-Z0-9_-]{1,15}$/.test(value.netbios) || !/^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}$/.test(value.dnsServer))
    throw new Error("AD yap\u0131land\u0131rmas\u0131 eksik veya ge\xE7ersiz. NODERA_AD_* ve Tailscale paket ayarlar\u0131n\u0131 kontrol edin.");
  return value;
}
async function initializeDirectory(db) {
  await db.collection("directory_machines").createIndex({ computerName: 1 }, { unique: true });
  await db.collection("directory_accounts").createIndex({ username: 1 }, { unique: true });
  await db.collection("directory_jobs").createIndex({ status: 1, createdAt: 1 });
  await db.collection("directory_jobs").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}
var DirectoryService = class {
  constructor(db, options) {
    this.db = db;
    this.options = options;
    this.machines = db.collection("directory_machines");
    this.jobs = db.collection("directory_jobs");
    this.accounts = db.collection("directory_accounts");
  }
  db;
  options;
  machines;
  jobs;
  accounts;
  config() {
    const { agentToken: _token, dataKey: _key, ...config } = this.options;
    return config;
  }
  async agentOnline() {
    const agent = await this.db.collection("directory_agent").findOne({ name: "dc1" });
    return agent?.seenAt instanceof Date && agent.seenAt.getTime() > Date.now() - 12e4;
  }
  seal(value) {
    const iv = (0, import_node_crypto3.randomBytes)(12), cipher = (0, import_node_crypto3.createCipheriv)("aes-256-gcm", Buffer.from(this.options.dataKey, "hex"), iv);
    return Buffer.concat([iv, cipher.update(JSON.stringify(value)), cipher.final(), cipher.getAuthTag()]).toString("base64");
  }
  open(value) {
    const data = Buffer.from(value, "base64"), decipher = (0, import_node_crypto3.createDecipheriv)("aes-256-gcm", Buffer.from(this.options.dataKey, "hex"), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(-16));
    return JSON.parse(Buffer.concat([decipher.update(data.subarray(12, -16)), decipher.final()]).toString("utf8"));
  }
  async enqueue(kind, ownerId, payload, machine, id = (0, import_node_crypto3.randomUUID)()) {
    const job = { _id: id, kind, ownerId, ...machine ? { machineId: machine.machineId, generation: machine.generation } : {}, encrypted: this.seal(payload), status: "queued", createdAt: /* @__PURE__ */ new Date(), expiresAt: new Date(Date.now() + 30 * 6e4) };
    await this.jobs.insertOne(job);
    return id;
  }
  publicMachine(doc) {
    const { machineId, deviceId, generation, computerName, phase, jobId, group, error } = doc;
    return { machineId, deviceId, generation, computerName, phase, jobId, ...group ? { group } : {}, ...error ? { error } : {} };
  }
  async owned(userId, machineId) {
    let value = await this.machines.findOne({ _id: machineId, ownerId: userId });
    if (!value) throw new HttpError(404, "VM'nin domain haz\u0131rl\u0131\u011F\u0131 bulunamad\u0131.");
    const job = await this.jobs.findOne({ _id: value.jobId });
    if (job && (job.status === "done" || job.status === "failed")) {
      await this.reconcile(job);
      value = await this.machines.findOne({ _id: machineId, ownerId: userId });
      if (!value) throw new HttpError(404, "VM'nin domain haz\u0131rl\u0131\u011F\u0131 temizlendi.");
    }
    if (["preparing", "joining", "verifying", "cleaning"].includes(value.phase) && (!job || job.expiresAt.getTime() <= Date.now()) && (value.changedAt?.getTime() ?? 0) < Date.now() - 3e4) {
      await this.machines.updateOne({ _id: machineId, generation: value.generation, jobId: value.jobId }, { $set: { phase: "failed", error: "AD haz\u0131rl\u0131\u011F\u0131n\u0131n s\xFCresi doldu. Temizleyip yeniden haz\u0131rlay\u0131n." } });
      value.phase = "failed";
    }
    return value;
  }
  async account(userId) {
    let value = await this.accounts.findOne({ _id: userId });
    if (value?.state === "pending") {
      const job = await this.jobs.findOne({ _id: value.jobId });
      if (job && ["done", "failed"].includes(job.status)) {
        await this.reconcile(job);
        value = await this.accounts.findOne({ _id: userId });
      } else if ((!job || job.expiresAt.getTime() <= Date.now()) && (value.changedAt?.getTime() ?? 0) < Date.now() - 3e4) {
        await this.accounts.updateOne({ _id: userId, jobId: value.jobId }, { $set: { state: "failed" } });
        value.state = "failed";
      }
    }
    return value ? { username: value.username, domain: value.domain, state: value.state, ...value.profile ? { profile: value.profile } : {}, ...value.error ? { error: value.error } : {} } : null;
  }
  async setAccount(user, body) {
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "", password = body.password;
    if (!windowsUsername.test(username) || /^(administrator|admin|guest|krbtgt|dc1|defaultaccount)$/.test(username) || password !== void 0 && (typeof password !== "string" || password.length < 14 || password.length > 128 || /[\x00\r\n]/.test(password)))
      throw new HttpError(400, "Windows kullan\u0131c\u0131 ad\u0131 3\u201320 k\xFC\xE7\xFCk harf/rakam, alt \xE7izgi veya tire; parola en az 14 karakter olmal\u0131.");
    await this.account(user.id);
    const existing = await this.accounts.findOne({ _id: user.id });
    if (existing?.state === "pending") throw new HttpError(409, "Windows hesab\u0131 i\u015Flemi devam ediyor.");
    if (existing && existing.username !== username) throw new HttpError(409, "Mevcut Windows hesab\u0131n\u0131n kullan\u0131c\u0131 ad\u0131 de\u011Fi\u015Ftirilemez.");
    let profile = existing?.profile;
    if (body.profile !== void 0) {
      try {
        profile = readWindowsAccountProfile(body.profile);
      } catch (error) {
        throw new HttpError(400, error.message);
      }
    }
    if (!existing && (password === void 0 || !profile)) throw new HttpError(400, "Yeni Windows hesab\u0131 i\xE7in ad, soyad, e-posta ve parola gerekli.");
    if (existing && password === void 0 && body.profile === void 0) throw new HttpError(400, "G\xFCncellenecek Windows hesab\u0131 bilgilerini gir.");
    const jobId = (0, import_node_crypto3.randomUUID)();
    try {
      if (existing) {
        const saved = await this.accounts.updateOne({ _id: user.id, jobId: existing.jobId, state: { $ne: "pending" } }, { $set: { state: "pending", jobId, changedAt: /* @__PURE__ */ new Date(), ...profile ? { profile } : {} }, $unset: { error: "" } });
        if (!saved.modifiedCount) throw new HttpError(409, "Windows hesab\u0131 i\u015Flemi devam ediyor.");
      } else await this.accounts.insertOne({ _id: user.id, username, domain: this.options.netbios, state: "pending", jobId, changedAt: /* @__PURE__ */ new Date(), profile });
    } catch (error) {
      await this.jobs.deleteOne({ _id: jobId, status: "queued" });
      if (error instanceof import_mongodb2.MongoServerError && error.code === 11e3) throw new HttpError(409, "Bu Windows kullan\u0131c\u0131 ad\u0131 kullan\u0131l\u0131yor veya ba\u015Fka bir hesap i\u015Flemi devam ediyor.");
      throw error;
    }
    try {
      await this.enqueue("account", user.id, { userId: user.id, username, ...password !== void 0 ? { password } : {}, ...profile ? { profile } : {}, objectGuid: existing?.objectGuid }, void 0, jobId);
    } catch (error) {
      await this.accounts.updateOne({ _id: user.id, jobId }, { $set: { state: "failed" } });
      throw error;
    }
    return this.account(user.id);
  }
  async prepare(user, body) {
    const { machineId, deviceId } = body;
    if (typeof machineId !== "string" || !directoryUuid.test(machineId) || typeof deviceId !== "string" || !directoryUuid.test(deviceId)) throw new HttpError(400, "Makine veya cihaz kimli\u011Fi ge\xE7ersiz.");
    const old = await this.machines.findOne({ _id: machineId });
    if (old) {
      if (old.ownerId !== user.id || old.deviceId !== deviceId) throw new HttpError(403, "Makinenin sahipli\u011Fi uyu\u015Fmuyor.");
      const current = await this.owned(user.id, machineId);
      if (current.phase === "cleaning" || current.phase === "failed") throw new HttpError(409, "\xD6nce \xF6nceki AD/VPN haz\u0131rl\u0131\u011F\u0131n\u0131 temizleyin.");
      return this.publicMachine(current);
    }
    const generation = (0, import_node_crypto3.randomUUID)(), jobId = (0, import_node_crypto3.randomUUID)();
    const doc = { _id: machineId, machineId, deviceId, ownerId: user.id, generation, computerName: "ND-" + generation.replaceAll("-", "").slice(0, 12).toUpperCase(), phase: "preparing", jobId, changedAt: /* @__PURE__ */ new Date() };
    await this.machines.insertOne(doc);
    await this.enqueue("provision", user.id, { ...this.publicMachine(doc), ownerId: user.id }, doc, jobId);
    return this.publicMachine(doc);
  }
  async bootstrap(user, id) {
    const machine = await this.owned(user.id, id), job = await this.jobs.findOne({ _id: machine.jobId, status: "done", expiresAt: { $gt: /* @__PURE__ */ new Date() } });
    if (machine.phase !== "joining" || !job?.result || job.kind !== "provision") throw new HttpError(409, "VM kat\u0131l\u0131m bilgisi hen\xFCz haz\u0131r de\u011Fil veya s\xFCresi doldu.");
    return { ...this.publicMachine(machine), ...this.open(job.result), config: this.config() };
  }
  async verify(user, id, body) {
    const machine = await this.owned(user.id, id);
    if (body.generation !== machine.generation || body.computerName !== machine.computerName || body.domain !== this.options.domain || body.secureChannel !== true || body.nla !== true) throw new HttpError(409, "VM'nin domain ve ba\u011Flant\u0131 kan\u0131t\u0131 uyu\u015Fmuyor.");
    if (machine.phase === "ready" || machine.phase === "verifying") return this.publicMachine(machine);
    if (machine.phase !== "joining") throw new HttpError(409, "VM domain kat\u0131l\u0131m\u0131 i\xE7in haz\u0131r de\u011Fil.");
    const jobId = (0, import_node_crypto3.randomUUID)();
    const changed = await this.machines.updateOne({ _id: id, generation: machine.generation, phase: "joining" }, { $set: { phase: "verifying", jobId, changedAt: /* @__PURE__ */ new Date() } });
    if (changed.modifiedCount) await this.enqueue("verify", user.id, { ...this.publicMachine(machine), ownerId: user.id, computerGuid: machine.computerGuid }, machine, jobId);
    return this.publicMachine(await this.owned(user.id, id));
  }
  async cleanup(userId, id) {
    if (await this.db.collection("rental_listings").findOne({ ownerId: userId, machineId: id, resetRequired: false, "lease.phase": { $in: ["reserved", "active"] } }, { projection: { _id: 1 } })) throw new HttpError(409, "Aktif kiralama bitmeden makinenin AD/VPN kimli\u011Fi temizlenemez.");
    const machine = await this.owned(userId, id);
    if (machine.phase === "cleaning") return this.publicMachine(machine);
    const jobId = (0, import_node_crypto3.randomUUID)();
    const saved = await this.machines.updateOne({ _id: id, generation: machine.generation, jobId: machine.jobId }, { $set: { phase: "cleaning", jobId, changedAt: /* @__PURE__ */ new Date() } });
    if (saved.modifiedCount) await this.enqueue("cleanup", userId, { ...this.publicMachine(machine), ownerId: userId, computerGuid: machine.computerGuid, deviceNodeId: machine.deviceNodeId }, machine, jobId);
    return this.publicMachine(await this.owned(userId, id));
  }
  async assertReady(ownerId, machineId, generation) {
    const machine = await this.owned(ownerId, machineId);
    if (machine.phase !== "ready" || machine.generation !== generation) throw new HttpError(409, "VM'nin AD/VPN do\u011Frulamas\u0131 tamamlanmad\u0131.");
    return machine;
  }
  async grant(machine, guestId, leaseId) {
    const account = await this.accounts.findOne({ _id: guestId, state: "ready" });
    if (!account?.sid) throw new HttpError(409, "\xD6nce Windows hesab\u0131m ekran\u0131ndan ki\u015Fisel hesab\u0131n\u0131 haz\u0131rla.");
    const jobId = await this.enqueue("grant", machine.ownerId, { machineId: machine.machineId, generation: machine.generation, computerName: machine.computerName, ownerId: machine.ownerId, group: machine.group, username: account.username, sid: account.sid, leaseId }, machine);
    return { jobId, username: `${this.options.netbios}\\${account.username}` };
  }
  async jobDone(id) {
    const job = await this.jobs.findOne({ _id: id, expiresAt: { $gt: /* @__PURE__ */ new Date() } });
    if (!job || job.status === "failed") throw new HttpError(409, job?.error ?? "AD i\u015Flemi tamamlanamad\u0131.");
    return job.status === "done";
  }
  authenticate(token) {
    return (0, import_node_crypto3.timingSafeEqual)((0, import_node_crypto3.createHash)("sha256").update(token).digest(), (0, import_node_crypto3.createHash)("sha256").update(this.options.agentToken).digest());
  }
  async claim() {
    await this.db.collection("directory_agent").updateOne({ name: "dc1" }, { $set: { seenAt: /* @__PURE__ */ new Date() } }, { upsert: true });
    const claim = (0, import_node_crypto3.randomBytes)(32).toString("hex"), now = /* @__PURE__ */ new Date();
    const job = await this.jobs.findOneAndUpdate({ expiresAt: { $gt: now }, $or: [{ status: "queued" }, { status: "running", claimUntil: { $lt: now } }] }, { $set: { status: "running", claim, claimUntil: new Date(Date.now() + 18e4) } }, { sort: { createdAt: 1 }, returnDocument: "after" });
    if (!job) return null;
    const current = job.kind === "account" ? await this.accounts.findOne({ _id: job.ownerId, jobId: job._id }) : job.machineId ? await this.machines.findOne({ _id: job.machineId, generation: job.generation, ...job.kind === "grant" ? { phase: "ready" } : { jobId: job._id } }) : null;
    if (!current) {
      await this.jobs.updateOne({ _id: job._id, claim }, { $set: { status: "failed", error: "AD i\u015Flemi daha yeni bir istekle de\u011Fi\u015Ftirildi." }, $unset: { encrypted: "", claim: "" } });
      return null;
    }
    return { id: job._id, kind: job.kind, claim, payload: this.open(job.encrypted), config: this.config() };
  }
  async complete(id, body) {
    if (!directoryUuid.test(id) || typeof body.claim !== "string" || typeof body.success !== "boolean" || !body.result || typeof body.result !== "object" || Array.isArray(body.result)) throw new HttpError(400, "AD i\u015F sonucu ge\xE7ersiz.");
    const job = await this.jobs.findOne({ _id: id, status: "running", claim: body.claim, claimUntil: { $gt: /* @__PURE__ */ new Date() }, expiresAt: { $gt: /* @__PURE__ */ new Date() } });
    if (!job) throw new HttpError(409, "AD i\u015Finin s\xFCresi veya sahipli\u011Fi de\u011Fi\u015Fti.");
    const result = body.result;
    if (body.success) {
      if (job.kind === "provision" && (typeof result.odj !== "string" || result.odj.length > 18e4 || typeof result.authKey !== "string" || !directoryUuid.test(String(result.computerGuid)) || !/^GG_ND_[A-F0-9]{12}$/.test(String(result.group)))) throw new HttpError(400, "Domain haz\u0131rl\u0131k sonucu ge\xE7ersiz.");
      if (job.kind === "account" && (!/^S-1-5-21-[\d-]+$/.test(String(result.sid)) || !directoryUuid.test(String(result.objectGuid)))) throw new HttpError(400, "Windows hesab\u0131 sonucu ge\xE7ersiz.");
      if (job.kind === "verify" && (!/^100\./.test(String(result.ip)) || typeof result.deviceNodeId !== "string" || !result.deviceNodeId)) throw new HttpError(400, "VPN do\u011Frulama sonucu ge\xE7ersiz.");
      if (job.kind === "account") {
        const requested = this.open(job.encrypted).profile;
        const confirmed = result.profile;
        if (requested && (!confirmed || ["givenName", "surname", "email"].some((key) => confirmed[key] !== requested[key]))) {
          body.success = false;
          result.code = "DIRECTORY_ACCOUNT_PROFILE";
        }
      }
    }
    const codes = {
      DIRECTORY_ACCOUNT: "Windows hesab\u0131 olu\u015Fturulamad\u0131. Kullan\u0131c\u0131 ad\u0131, AD parola politikas\u0131 ve Users OU yetkisini kontrol edin.",
      DIRECTORY_ACCOUNT_PROFILE: "AD profil alanlar\u0131 do\u011Frulanamad\u0131. DC1 \xFCzerindeki Nodera AD arac\u0131s\u0131n\u0131 profil destekleyen s\xFCr\xFCme g\xFCncelleyip yeniden deneyin.",
      DIRECTORY_DOMAIN_JOIN: "Domain kat\u0131l\u0131m verisi olu\u015Fturulamad\u0131. DC1 \xFCzerindeki servis hesab\u0131n\u0131n Computers OU yetkisini kontrol edin.",
      DIRECTORY_VPN_KEY: "Tailscale kay\u0131t anahtar\u0131 olu\u015Fturulamad\u0131. DC1 \xFCzerindeki OAuth istemcisinin auth_keys yetkisini ve VM etiketini kontrol edin.",
      DIRECTORY_DNS: "VM'nin dinamik DNS kayd\u0131 VPN IP'siyle uyu\u015Fmuyor. VM DNS kayd\u0131n\u0131 ve DC1 DNS hizmetini kontrol edin.",
      DIRECTORY_GRANT: "Ki\u015Fisel Windows hesab\u0131n\u0131n VM oturum izni verilemedi. Parola s\xFCresini ve VM grubunu kontrol edin.",
      DIRECTORY_CLEANUP: "\xD6nceki AD/VPN kimli\u011Fi temizlenemedi. DC1 arac\u0131s\u0131, Tailscale devices:core izni ve OU yetkilerini kontrol edin."
    };
    const error = codes[String(result.code)] ?? "AD arac\u0131s\u0131 i\u015Flemi tamamlayamad\u0131. DC1 \xFCzerindeki Nodera AD hizmetini ve ilgili OU yetkilerini kontrol edin.";
    const saved = await this.jobs.updateOne({ _id: id, status: "running", claim: body.claim }, { $set: { status: body.success ? "done" : "failed", ...body.success ? { result: this.seal(result) } : { error } }, $unset: { encrypted: "", claim: "" } });
    if (!saved.modifiedCount) throw new HttpError(409, "AD sonucu zaten i\u015Flendi.");
    await this.reconcile(await this.jobs.findOne({ _id: id }));
    return { ok: true };
  }
  async reconcile(job) {
    if (job.status !== "done" && job.status !== "failed") return;
    const id = job._id, success = job.status === "done", result = job.result ? this.open(job.result) : {}, error = job.error;
    if (job.kind === "account") await this.accounts.updateOne({ _id: job.ownerId, jobId: id, state: "pending" }, { $set: success ? { state: "ready", sid: String(result.sid), objectGuid: String(result.objectGuid) } : { state: "failed", error } });
    if (job.machineId && ["provision", "verify", "cleanup"].includes(job.kind)) {
      if (success && job.kind === "cleanup") {
        await this.machines.deleteOne({ _id: job.machineId, generation: job.generation, jobId: id, phase: "cleaning" });
        await this.jobs.updateMany({ machineId: job.machineId, generation: job.generation, _id: { $ne: id }, status: { $in: ["done", "failed"] } }, { $unset: { encrypted: "", result: "" } });
      } else {
        await this.machines.updateOne({ _id: job.machineId, generation: job.generation, jobId: id }, { $set: success ? job.kind === "provision" ? { phase: "joining", computerGuid: String(result.computerGuid), group: String(result.group) } : { phase: "ready", deviceNodeId: String(result.deviceNodeId) } : { phase: "failed", error } });
        if (success && job.kind === "verify") await this.jobs.updateMany({ machineId: job.machineId, generation: job.generation, kind: "provision" }, { $unset: { result: "", encrypted: "" } });
      }
    }
  }
};

// apps/api/src/store.ts
var fallbackHash = "0".repeat(32) + ":" + "0".repeat(128);
var publicUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email
});
var AccountStore = class {
  constructor(db) {
    this.db = db;
  }
  db;
  get database() {
    return this.db;
  }
  get accounts() {
    return this.db.collection("users");
  }
  get sessions() {
    return this.db.collection("auth_sessions");
  }
  get attempts() {
    return this.db.collection("auth_attempts");
  }
  async initialize() {
    await initializeMarketplace(this.db);
    await initializeDirectory(this.db);
    await this.accounts.createIndex(
      { email: 1 },
      { unique: true, name: "unique_email" }
    );
    await this.sessions.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "expired_sessions" }
    );
    await this.sessions.createIndex({ userId: 1 });
    await this.attempts.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "expired_attempts" }
    );
  }
  async ping() {
    await this.db.command({ ping: 1 });
  }
  async rateLimit(key, limit) {
    const now = Date.now(), window = 6e5;
    const id = `${key}:${Math.floor(now / window)}`;
    const update = {
      $inc: { count: 1 },
      $setOnInsert: {
        expiresAt: new Date((Math.floor(now / window) + 1) * window)
      }
    };
    let result;
    try {
      result = await this.attempts.findOneAndUpdate({ _id: id }, update, {
        upsert: true,
        returnDocument: "after"
      });
    } catch (error) {
      if (!(error instanceof import_mongodb3.MongoServerError) || error.code !== 11e3)
        throw error;
      result = await this.attempts.findOneAndUpdate({ _id: id }, update, {
        returnDocument: "after"
      });
    }
    if (!result || result.count > limit)
      throw new HttpError(
        429,
        "\xC7ok fazla deneme. 10 dakika sonra tekrar deneyin."
      );
  }
  async register(name, email, password, remember = false) {
    const id = (0, import_node_crypto4.randomUUID)();
    const account = {
      _id: id,
      id,
      name,
      email,
      passwordHash: await hashPassword(password),
      createdAt: /* @__PURE__ */ new Date()
    };
    try {
      await this.accounts.insertOne(account);
    } catch (error) {
      if (error instanceof import_mongodb3.MongoServerError && error.code === 11e3)
        throw new HttpError(409, "Bu e-posta ile zaten bir hesap var.");
      throw error;
    }
    return this.issueSession(account, remember);
  }
  async login(email, password, remember = false) {
    const account = await this.accounts.findOne({ email });
    const valid = await verifyPassword(
      password,
      account?.passwordHash ?? fallbackHash
    );
    if (!account || !valid)
      throw new HttpError(401, "E-posta veya parola hatal\u0131.");
    return this.issueSession(account, remember);
  }
  async issueSession(account, remember) {
    const token = (0, import_node_crypto4.randomBytes)(32).toString("hex");
    const expiresAt = new Date(Date.now() + (remember ? 30 : 1) * 864e5);
    await this.sessions.insertOne({
      _id: tokenHash(token),
      userId: account.id,
      createdAt: /* @__PURE__ */ new Date(),
      expiresAt
    });
    return {
      user: publicUser(account),
      token,
      expiresAt: expiresAt.toISOString()
    };
  }
  async userFor(token) {
    const session = await this.sessions.findOne({
      _id: tokenHash(token),
      expiresAt: { $gt: /* @__PURE__ */ new Date() }
    });
    if (!session)
      throw new HttpError(401, "Oturumun sona erdi. Yeniden giri\u015F yap.");
    const account = await this.accounts.findOne({ _id: session.userId });
    if (!account)
      throw new HttpError(401, "Hesap bulunamad\u0131. Yeniden giri\u015F yap.");
    return publicUser(account);
  }
  async logout(token) {
    await this.sessions.deleteOne({ _id: tokenHash(token) });
  }
};
async function connectAccounts(uri, databaseName) {
  if (!/^mongodb(?:\+srv)?:\/\//.test(uri))
    throw new IdentityStartupError("CONFIG_URI");
  if (!/^[a-zA-Z0-9_-]{1,63}$/.test(databaseName))
    throw new IdentityStartupError("CONFIG_DATABASE");
  const client = new import_mongodb3.MongoClient(uri, {
    appName: "Nodera Identity",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5e3,
    connectTimeoutMS: 5e3,
    socketTimeoutMS: 5e3,
    timeoutMS: 5e3
  });
  try {
    await client.connect();
    const store = new AccountStore(client.db(databaseName));
    await store.initialize();
    return { store, client };
  } catch (error) {
    await client.close();
    throw error;
  }
}

// apps/api/src/app.ts
var import_node_http = __toESM(require("node:http"), 1);
var import_node_crypto6 = require("node:crypto");
var import_node_net = require("node:net");

// apps/api/src/relay.ts
var import_ws = require("ws");
var import_node_crypto5 = require("node:crypto");

// packages/shared/src/marketplace-filters.ts
var marketResources = ["cpu", "memory", "storage"];
var marketSorts = {
  newest: "Son eklenen",
  cpuAsc: "\u0130\u015Flemci: azdan \xE7o\u011Fa",
  cpuDesc: "\u0130\u015Flemci: \xE7oktan aza",
  memoryAsc: "RAM: azdan \xE7o\u011Fa",
  memoryDesc: "RAM: \xE7oktan aza",
  storageAsc: "Depolama: azdan \xE7o\u011Fa",
  storageDesc: "Depolama: \xE7oktan aza"
};
var defaultMarketFilters = {
  cpuMin: 0,
  cpuMax: 0,
  memoryMin: 0,
  memoryMax: 0,
  storageMin: 0,
  storageMax: 0,
  sort: "newest",
  page: 1
};
function readMarketFilters(params = new URLSearchParams()) {
  const result = { ...defaultMarketFilters };
  for (const key of params.keys()) {
    if (!Object.hasOwn(defaultMarketFilters, key) || params.getAll(key).length !== 1)
      throw new Error("Filtre parametresi ge\xE7ersiz.");
  }
  for (const resource of marketResources) {
    for (const bound of ["Min", "Max"]) {
      const key = `${resource}${bound}`;
      const value = params.get(key);
      if (value === null) continue;
      if (!/^\d{1,5}$/.test(value)) throw new Error("Kaynak filtresi tam say\u0131 olmal\u0131.");
      const limit = resource === "cpu" ? 256 : resource === "memory" ? 1024 : 65536;
      const number = Number(value);
      if (number > limit) throw new Error("Kaynak filtresi desteklenen aral\u0131\u011F\u0131n d\u0131\u015F\u0131nda.");
      result[key] = number;
    }
    if (result[`${resource}Max`] && result[`${resource}Min`] > result[`${resource}Max`])
      throw new Error("En az de\u011Feri en \xE7ok de\u011Ferinden b\xFCy\xFCk olamaz.");
  }
  const sort = params.get("sort");
  if (sort !== null) {
    if (!Object.hasOwn(marketSorts, sort)) throw new Error("S\u0131ralama ge\xE7ersiz.");
    result.sort = sort;
  }
  const page = params.get("page");
  if (page !== null) {
    if (!/^[1-9]\d{0,4}$/.test(page)) throw new Error("Sayfa numaras\u0131 ge\xE7ersiz.");
    result.page = Number(page);
  }
  return result;
}

// apps/api/src/relay.ts
function createRentalRelay(server, accounts, rateSecret, directory) {
  const market = new MarketplaceStore(accounts.database);
  const hosts = /* @__PURE__ */ new Map();
  const pairs = /* @__PURE__ */ new Map();
  const credentials2 = /* @__PURE__ */ new Map();
  const clients = /* @__PURE__ */ new Map();
  const wss = new import_ws.WebSocketServer({
    noServer: true,
    maxPayload: 65536,
    perMessageDeflate: false
  });
  const key = (owner, device) => `${owner}:${device}`;
  const peerFor = (listing) => hosts.get(key(listing.ownerId, listing.deviceId));
  const online = (listing) => {
    if (directory && !listing.directoryGeneration) return false;
    const peer = peerFor(listing);
    return !!peer && peer.ws.readyState === import_ws.WebSocket.OPEN && peer.seen > Date.now() - 3e4 && peer.ready.has(listing.machineId);
  };
  const send = (peer, message) => {
    if (peer?.ws.readyState === import_ws.WebSocket.OPEN)
      peer.ws.send(JSON.stringify(message));
  };
  function closePair(id) {
    const pair = pairs.get(id);
    if (!pair) return;
    pairs.delete(id);
    clearTimeout(pair.timer);
    for (const stream of pair.streams ?? []) stream.destroy();
    pair.host?.terminate();
    pair.guest?.terminate();
  }
  async function end(listing) {
    if (!listing.lease) return;
    closePair(listing.lease.id);
    await market.end(listing);
    if (directory && listing.directoryGeneration) await directory.cleanup(listing.ownerId, listing.machineId).catch(() => {
    });
    send(peerFor(listing), {
      type: "reset",
      listingId: listing._id,
      machineId: listing.machineId,
      leaseId: listing.lease.id
    });
  }
  async function pending(peer) {
    const dirty = await market.listings.find({
      ownerId: peer.user.id,
      deviceId: peer.deviceId,
      resetRequired: true
    }).limit(16).toArray();
    for (const listing of dirty)
      send(peer, {
        type: "reset",
        listingId: listing._id,
        machineId: listing.machineId,
        leaseId: listing.lease?.id
      });
  }
  server.on("upgrade", (req, socket, head) => {
    socket.on("error", () => {
    });
    const deadline = setTimeout(() => socket.destroy(), 8e3);
    void (async () => {
      const url = new URL(req.url ?? "/", "http://relay.local");
      const token = req.headers.authorization?.match(
        /^Bearer ([a-f0-9]{64})$/
      )?.[1];
      if (!token || req.headers.origin || clients.size >= 256)
        throw new Error();
      const user = await accounts.userFor(token);
      const deviceId = url.searchParams.get("deviceId") ?? "";
      const control = url.pathname === "/v1/relay/host" && uuid.test(deviceId);
      const data = url.pathname.match(
        /^\/v1\/relay\/data\/([a-f0-9-]{36})\/(host|guest)$/
      );
      let listing = null;
      if (!control) {
        if (!data) throw new Error();
        listing = await market.forLease(data[1]);
        if (!listing?.lease || listing.resetRequired || listing.lease.expiresAt.getTime() <= Date.now() || !online(listing))
          throw new Error();
        if (data[2] === "host" ? listing.ownerId !== user.id || listing.deviceId !== deviceId : listing.lease.guestId !== user.id)
          throw new Error();
        if (listing.directoryGeneration) {
          if (!directory || !listing.lease.startedAt) throw new Error();
          await directory.assertReady(listing.ownerId, listing.machineId, listing.directoryGeneration);
        }
        const pair = pairs.get(data[1]);
        if (pair?.[data[2]]) throw new Error();
      }
      clearTimeout(deadline);
      if (socket.destroyed) return;
      wss.handleUpgrade(req, socket, head, (ws) => {
        clients.set(ws, token);
        ws.on("error", () => {
        });
        ws.on("close", () => clients.delete(ws));
        if (control) {
          const hostKey = key(user.id, deviceId);
          hosts.get(hostKey)?.ws.terminate();
          const peer = {
            ws,
            user,
            token,
            deviceId,
            seen: Date.now(),
            ready: /* @__PURE__ */ new Set()
          };
          hosts.set(hostKey, peer);
          ws.send(JSON.stringify({ type: "ready" }));
          ws.on("message", (raw, binary) => {
            if (binary || raw.toString().length > 8192) {
              ws.terminate();
              return;
            }
            try {
              const message = JSON.parse(raw.toString());
              if (message.type !== "heartbeat" || !Array.isArray(message.ready) || message.ready.length > 16 || !message.ready.every(
                (id) => typeof id === "string" && uuid.test(id)
              ))
                throw new Error();
              peer.ready = new Set(message.ready);
              peer.seen = Date.now();
              ws.send(JSON.stringify({ type: "heartbeat" }));
              void pending(peer).catch(() => ws.terminate());
            } catch {
              ws.terminate();
            }
          });
          ws.on("close", () => {
            if (hosts.get(hostKey) !== peer) return;
            hosts.delete(hostKey);
            void market.listings.find({ ownerId: user.id, deviceId }).toArray().then(async (listings) => {
              for (const item2 of listings) {
                credentials2.delete(item2._id);
                if (item2.lease && item2.lease.phase !== "resetting") {
                  if (item2.directoryGeneration) closePair(item2.lease.id);
                  else await end(item2);
                }
              }
            }).catch(() => {
            });
          });
          return;
        }
        const item = listing;
        ws.pause();
        const leaseId = item.lease.id;
        let pair = pairs.get(leaseId);
        if (!pair) {
          pair = {
            timer: setTimeout(() => {
              if (item.directoryGeneration) closePair(leaseId);
              else void end(item).catch(() => closePair(leaseId));
            }, 2e4)
          };
          pairs.set(leaseId, pair);
        }
        pair[data[2]] = ws;
        ws.on("close", () => {
          if (pairs.has(leaseId)) {
            if (item.directoryGeneration) closePair(leaseId);
            else void end(item).catch(() => closePair(leaseId));
          }
        });
        if (data[2] === "guest" && !pair.host)
          send(peerFor(item), {
            type: "connect",
            machineId: item.machineId,
            listingId: item._id,
            leaseId,
            ...item.directoryGeneration ? { expiresAt: item.lease.expiresAt.toISOString(), directoryGeneration: item.directoryGeneration } : {}
          });
        if (pair.host && pair.guest && !pair.pairing) {
          pair.pairing = true;
          const connectedPair = pair;
          void market.listings.updateOne(
            {
              _id: item._id,
              "lease.id": leaseId,
              "lease.phase": { $in: ["reserved", "active"] },
              resetRequired: false
            },
            {
              $set: {
                "lease.phase": "active",
                ...item.directoryGeneration ? {} : { "lease.expiresAt": new Date(Date.now() + 60 * 6e4) }
              }
            }
          ).then((result) => {
            if (!result.matchedCount || pairs.get(leaseId) !== connectedPair) {
              closePair(leaseId);
              return;
            }
            clearTimeout(connectedPair.timer);
            const left = (0, import_ws.createWebSocketStream)(connectedPair.host, {
              highWaterMark: 65536
            });
            const right = (0, import_ws.createWebSocketStream)(connectedPair.guest, {
              highWaterMark: 65536
            });
            connectedPair.streams = [left, right];
            for (const stream of connectedPair.streams)
              stream.on("error", () => {
                if (item.directoryGeneration) closePair(leaseId);
                else void end(item).catch(() => closePair(leaseId));
              });
            left.pipe(right);
            right.pipe(left);
            connectedPair.host.resume();
            connectedPair.guest.resume();
          }).catch(() => {
            if (item.directoryGeneration) closePair(leaseId);
            else void end(item).catch(() => closePair(leaseId));
          });
        }
      });
    })().catch(() => {
      clearTimeout(deadline);
      if (!socket.destroyed)
        socket.end("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
    });
  });
  let checking = false;
  const timer = setInterval(() => {
    if (checking) return;
    checking = true;
    void (async () => {
      for (const [ws, token] of clients) {
        try {
          await accounts.userFor(token);
        } catch {
          ws.terminate();
        }
      }
      for (const peer of hosts.values())
        if (peer.seen < Date.now() - 3e4) peer.ws.terminate();
      const expired = await market.listings.find({
        "lease.phase": { $in: ["reserved", "active"] },
        "lease.expiresAt": { $lte: /* @__PURE__ */ new Date() }
      }).limit(100).toArray();
      for (const listing of expired) await end(listing);
    })().catch(() => {
      for (const ws of clients.keys()) ws.terminate();
    }).finally(() => {
      checking = false;
    });
  }, 1e4);
  timer.unref();
  const stop = () => {
    clearInterval(timer);
    for (const ws of clients.keys()) ws.terminate();
    for (const id of pairs.keys()) closePair(id);
    wss.close();
    credentials2.clear();
  };
  server.on("close", stop);
  return {
    stop,
    market,
    async handle(user, method, pathname, body, params = new URLSearchParams()) {
      const publicItem = (item) => ({
        ...market.public(
          item,
          online(item),
          item.ownerId === user.id || item.lease?.guestId === user.id
        ),
        ...online(item) ? { availabilityCheckedAt: new Date(peerFor(item).seen).toISOString() } : {}
      });
      if (method === "GET" && pathname === "/v1/marketplace") {
        let filters;
        try {
          filters = readMarketFilters(params);
        } catch (error) {
          throw new HttpError(400, error.message);
        }
        const readyHosts = [...hosts.values()].filter(
          (peer) => peer.ws.readyState === import_ws.WebSocket.OPEN && peer.seen > Date.now() - 3e4 && peer.ready.size
        ).map((peer) => ({ ownerId: peer.user.id, deviceId: peer.deviceId, machineId: { $in: [...peer.ready] } }));
        const query = {
          published: true,
          ownerId: { $ne: user.id },
          lease: null,
          resetRequired: false,
          ...directory ? { directoryGeneration: { $type: "string" } } : { _id: { $in: [...credentials2.keys()] } },
          $or: readyHosts.length ? readyHosts : [{ _id: "no-online-host" }]
        };
        for (const resource of marketResources) {
          const min = filters[`${resource}Min`], max = filters[`${resource}Max`];
          if (min || max) query[resource] = { ...min ? { $gte: min } : {}, ...max ? { $lte: max } : {} };
        }
        const sort = filters.sort === "newest" ? { updatedAt: -1, _id: 1 } : {
          [filters.sort.replace(/Asc|Desc$/, "")]: filters.sort.endsWith("Asc") ? 1 : -1,
          _id: 1
        };
        const pageSize = 12;
        const totalOffers = await market.listings.countDocuments(query);
        const page = Math.min(filters.page, Math.max(1, Math.ceil(totalOffers / pageSize)));
        const [offers, mine, rentals] = await Promise.all([
          market.listings.find(query).sort(sort).skip((page - 1) * pageSize).limit(pageSize).toArray(),
          market.listings.find({ ownerId: user.id }).limit(100).toArray(),
          market.listings.find({ "lease.guestId": user.id }).limit(20).toArray()
        ]);
        return {
          offers: offers.filter(online).map(publicItem),
          mine: mine.map(publicItem),
          rentals: rentals.map(publicItem),
          page,
          pageSize,
          totalOffers
        };
      }
      if (method === "POST" && pathname === "/v1/marketplace/publish") {
        const deviceId = String(body.deviceId ?? "");
        const peer = hosts.get(key(user.id, deviceId));
        if (!peer || !peer.ready.has(String(body.machineId)) || peer.seen < Date.now() - 3e4)
          throw new HttpError(
            409,
            "Makinenin \xE7evrimi\xE7i ve RDP ba\u011Flant\u0131s\u0131n\u0131n haz\u0131r olmas\u0131 gerekiyor."
          );
        if (directory) await directory.assertReady(user.id, String(body.machineId), body.directoryGeneration);
        if (!directory && (typeof body.username !== "string" || !/^[a-zA-Z0-9_.\\@-]{1,64}$/.test(body.username) || typeof body.password !== "string" || body.password.length < 12 || body.password.length > 128))
          throw new HttpError(
            400,
            "VM i\xE7in ayr\u0131 Windows kullan\u0131c\u0131 ad\u0131 ve en az 12 karakterli parolay\u0131 girin."
          );
        const item = await market.publish(user, deviceId, body);
        if (!directory) credentials2.set(item._id, { username: String(body.username), password: String(body.password) });
        return { offer: publicItem(item) };
      }
      const action = pathname.match(
        /^\/v1\/marketplace\/([a-f0-9-]{36})\/(reserve|unpublish|reset)$/
      );
      if (method === "POST" && action) {
        await accounts.rateLimit(
          (0, import_node_crypto5.createHmac)("sha256", rateSecret).update(`rental:${user.id}`).digest("hex"),
          60
        );
        const item = await market.listings.findOne({ _id: action[1] });
        if (!item) throw new HttpError(404, "Makine bulunamad\u0131.");
        if (action[2] === "reserve") {
          if (body.confirm !== true)
            throw new HttpError(
              400,
              "Oturum sonunda dosyalar\u0131n silinece\u011Fini onaylay\u0131n."
            );
          if (!online(item) || !item.directoryGeneration && !credentials2.has(item._id))
            throw new HttpError(409, "Makine \xE7evrimd\u0131\u015F\u0131.");
          if (item.directoryGeneration) {
            if (!directory) throw new HttpError(503, "AD hizmeti kapal\u0131.");
            const machine = await directory.assertReady(item.ownerId, item.machineId, item.directoryGeneration);
            if ((await directory.account(user.id))?.state !== "ready") throw new HttpError(409, "\xD6nce Windows hesab\u0131m ekran\u0131ndan hesab\u0131n\u0131 olu\u015Ftur.");
            const durationMinutes = Number(body.durationMinutes ?? 240);
            if (![60, 120, 240, 480, 720, 1440].includes(durationMinutes)) throw new HttpError(400, "Kiralama s\xFCresi ge\xE7ersiz.");
            const reserved = await market.reserve(user, item._id, durationMinutes);
            try {
              const grant = await directory.grant(machine, user.id, reserved.lease.id);
              await market.listings.updateOne({ _id: item._id, "lease.id": reserved.lease.id, "lease.phase": "reserved" }, { $set: { "lease.grantJobId": grant.jobId } });
              return { offer: publicItem(await market.forLease(reserved.lease.id)) };
            } catch (error) {
              await end(reserved);
              throw error;
            }
          }
          return { offer: publicItem(await market.reserve(user, item._id)) };
        }
        if (item.ownerId !== user.id || item.deviceId !== body.deviceId)
          throw new HttpError(403, "Bu makineyi y\xF6netemezsiniz.");
        if (action[2] === "reset") {
          if (typeof body.leaseId !== "string" || !uuid.test(body.leaseId))
            throw new HttpError(400, "Temizlenecek oturum kimli\u011Fi ge\xE7ersiz.");
          if (directory && item.directoryGeneration) {
            const machine = await directory.assertReady(user.id, item.machineId, body.directoryGeneration);
            if (!peerFor(item)?.ready.has(item.machineId)) throw new HttpError(409, "Yeni \xE7al\u0131\u015Fma ortam\u0131n\u0131n RDP kontrol\xFC tamamlanmal\u0131.");
            await market.reset(user.id, item.deviceId, item._id, body.leaseId, machine.generation, item.autoPublish === true);
          } else await market.reset(user.id, item.deviceId, item._id, body.leaseId);
          credentials2.delete(item._id);
          return { ok: true };
        }
        const unpublished = await market.listings.findOneAndUpdate(
          { _id: item._id, ownerId: user.id, deviceId: item.deviceId },
          { $set: { published: false, autoPublish: false } },
          { returnDocument: "after" }
        );
        if (!unpublished) throw new HttpError(404, "Makine bulunamad\u0131.");
        if (unpublished.lease) await end(unpublished);
        credentials2.delete(item._id);
        return { ok: true };
      }
      const rental = pathname.match(
        /^\/v1\/rentals\/([a-f0-9-]{36})\/(credentials|end)$/
      );
      if (rental) {
        const item = await market.forLease(rental[1]);
        if (!item?.lease || ![item.ownerId, item.lease.guestId].includes(user.id))
          throw new HttpError(404, "Oturum bulunamad\u0131.");
        if (method === "POST" && rental[2] === "end") {
          await end(item);
          return { ok: true };
        }
        if (method === "GET" && rental[2] === "credentials" && item.lease.guestId === user.id && !item.resetRequired && item.lease.expiresAt.getTime() > Date.now() && online(item)) {
          const value = credentials2.get(item._id);
          if (directory && item.directoryGeneration) {
            if (!item.lease.startedAt && (!item.lease.grantJobId || !await directory.jobDone(item.lease.grantJobId))) throw new HttpError(409, "Ki\u015Fisel Windows oturumunun yetkileri haz\u0131rlan\u0131yor.");
            const account = await directory.account(user.id);
            if (!account || account.state !== "ready") throw new HttpError(409, "Windows hesab\u0131 haz\u0131r de\u011Fil.");
            if (!item.lease.startedAt) await market.listings.updateOne({ _id: item._id, "lease.id": item.lease.id, "lease.phase": "reserved", "lease.startedAt": { $exists: false } }, { $set: { "lease.startedAt": /* @__PURE__ */ new Date(), "lease.expiresAt": new Date(Date.now() + (item.lease.durationMinutes ?? 240) * 6e4) } });
            const current = await market.forLease(item.lease.id);
            const machine = await directory.assertReady(item.ownerId, item.machineId, item.directoryGeneration);
            return { username: `${account.domain}\\${account.username}`, serverName: `${machine.computerName}.${directory.options.domain}`, domainAccount: true, expiresAt: current.lease.expiresAt.toISOString(), directoryGeneration: item.directoryGeneration };
          }
          if (!value)
            throw new HttpError(409, "Ba\u011Flant\u0131 yeniden haz\u0131rlanmal\u0131.");
          return value;
        }
        throw new HttpError(403, "Bu i\u015Flem i\xE7in oturum yetkin yok.");
      }
      throw new HttpError(404, "\u0130\u015Flem bulunamad\u0131.");
    }
  };
}

// apps/api/src/app.ts
function createIdentityServer(store, options) {
  if (options.rateSecret.length < 32)
    throw new Error("AUTH_RATE_SECRET en az 32 karakter olmal\u0131.");
  const directory = options.directory ? new DirectoryService(store.database, options.directory) : void 0;
  const server = import_node_http.default.createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "DENY");
    const json = (status, value) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      });
      res.end(JSON.stringify(value));
    };
    try {
      const route = `${req.method} ${new URL(req.url ?? "/", "http://identity.local").pathname}`;
      if (route === "GET /health") {
        await store.ping();
        json(200, {
          status: "ok",
          service: "nodera-identity",
          version: "0.5.0",
          capabilities: ["marketplace", "rdp-relay", ...directory ? ["directory-v1", "directory-marketplace-v1", "windows-account-profile-v1"] : []]
        });
        return;
      }
      if (req.headers.origin)
        throw new HttpError(403, "Bu kayna\u011Fa izin verilmiyor.");
      if (route.startsWith("POST /v1/ad-agent/")) {
        const token2 = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1] ?? "";
        if (!directory || !directory.authenticate(token2)) throw new HttpError(403, "Arac\u0131 yetkisi do\u011Frulanamad\u0131.");
        if (route === "POST /v1/ad-agent/claim") {
          json(200, { job: await directory.claim() });
          return;
        }
        const jobId = route.match(/^POST \/v1\/ad-agent\/jobs\/([a-f0-9-]{36})$/)?.[1];
        if (!jobId) throw new HttpError(404, "Arac\u0131 i\u015Flemi bulunamad\u0131.");
        json(200, await directory.complete(jobId, await readBody(req, 262144)));
        return;
      }
      if (route === "POST /v1/auth/register" || route === "POST /v1/auth/login") {
        let address = req.socket.remoteAddress ?? "unknown";
        if (options.trustProxy) {
          const forwarded = req.headers["x-forwarded-for"];
          const lastHop = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",").at(-1)?.trim();
          if (!lastHop || !(0, import_node_net.isIP)(lastHop))
            throw new HttpError(400, "Proxy adresi do\u011Frulanamad\u0131.");
          address = lastHop;
        }
        const key = (scope) => (0, import_node_crypto6.createHmac)("sha256", options.rateSecret).update(scope).digest("hex");
        await store.rateLimit(key(`ip:${address}`), 60);
        const body = await readBody(req);
        if (body.remember !== void 0 && typeof body.remember !== "boolean")
          throw new HttpError(400, "Oturum saklama se\xE7imi ge\xE7ersiz.");
        let email, password;
        try {
          ({ email, password } = credentials(body));
        } catch (error) {
          throw new HttpError(400, error.message);
        }
        await store.rateLimit(key(`email:${email}`), 15);
        if (route.endsWith("register")) {
          const name = typeof body.name === "string" ? body.name.trim() : "";
          if (name.length < 2 || name.length > 60)
            throw new HttpError(400, "Ad\u0131n\u0131z 2\u201360 karakter aras\u0131nda olmal\u0131.");
          json(
            201,
            await store.register(name, email, password, body.remember === true)
          );
        } else
          json(200, await store.login(email, password, body.remember === true));
        return;
      }
      const marketplaceRoute = /^\/(?:v1\/marketplace|v1\/rentals)(?:\/|$)/.test(
        new URL(req.url ?? "/", "http://identity.local").pathname
      );
      const directoryRoute = /^\/(?:v1\/directory)(?:\/|$)/.test(new URL(req.url ?? "/", "http://identity.local").pathname);
      if (route !== "GET /v1/auth/me" && route !== "POST /v1/auth/logout" && !marketplaceRoute && !directoryRoute)
        throw new HttpError(404, "\u0130\u015Flem bulunamad\u0131.");
      const match = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/);
      if (!match) throw new HttpError(401, "Devam etmek i\xE7in giri\u015F yap\u0131n.");
      const token = match[1];
      if (directoryRoute) {
        const user = await store.userFor(token), pathname = new URL(req.url ?? "/", "http://identity.local").pathname;
        if (route === "GET /v1/directory/config") {
          json(200, directory ? { ...directory.config(), agentOnline: await directory.agentOnline() } : { enabled: false });
          return;
        }
        if (!directory) throw new HttpError(503, "Sunucuda otomatik AD haz\u0131rl\u0131\u011F\u0131 hen\xFCz yap\u0131land\u0131r\u0131lmad\u0131.");
        if (route === "GET /v1/directory/account") {
          json(200, { account: await directory.account(user.id) });
          return;
        }
        if (route === "POST /v1/directory/account") {
          await store.rateLimit("directory-account:" + user.id, 12);
          json(200, { account: await directory.setAccount(user, await readBody(req)) });
          return;
        }
        if (route === "POST /v1/directory/machines") {
          await store.rateLimit("directory-machine:" + user.id, 30);
          json(200, { machine: await directory.prepare(user, await readBody(req)) });
          return;
        }
        const machineRoute = pathname.match(/^\/v1\/directory\/machines\/([a-f0-9-]{36})(?:\/(bootstrap|verify|cleanup))?$/);
        if (!machineRoute) throw new HttpError(404, "Domain i\u015Flemi bulunamad\u0131.");
        const [, id, action] = machineRoute;
        if (req.method === "GET" && !action) {
          json(200, { machine: directory.publicMachine(await directory.owned(user.id, id)) });
          return;
        }
        if (req.method === "GET" && action === "bootstrap") {
          json(200, await directory.bootstrap(user, id));
          return;
        }
        if (req.method === "POST" && action === "verify") {
          json(200, { machine: await directory.verify(user, id, await readBody(req)) });
          return;
        }
        if (req.method === "POST" && action === "cleanup") {
          json(200, { machine: await directory.cleanup(user.id, id) });
          return;
        }
        throw new HttpError(404, "Domain i\u015Flemi bulunamad\u0131.");
      }
      if (marketplaceRoute) {
        const user = await store.userFor(token);
        json(
          200,
          await relay.handle(
            user,
            req.method ?? "GET",
            new URL(req.url ?? "/", "http://identity.local").pathname,
            req.method === "POST" ? await readBody(req) : {},
            new URL(req.url ?? "/", "http://identity.local").searchParams
          )
        );
        return;
      }
      if (route.endsWith("logout")) {
        await store.logout(token);
        json(200, { ok: true });
      } else json(200, { user: await store.userFor(token) });
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 429) res.setHeader("Retry-After", "600");
        json(error.status, { error: error.message });
      } else {
        console.error("\xDCyelik veritaban\u0131 i\u015Flemi tamamlanamad\u0131.");
        json(503, {
          error: "\xDCyelik hizmetine \u015Fu anda ula\u015F\u0131lam\u0131yor. Biraz sonra tekrar deneyin."
        });
      }
    }
  });
  const relay = createRentalRelay(server, store, options.rateSecret, directory);
  server.requestTimeout = 15e3;
  server.headersTimeout = 1e4;
  server.maxHeadersCount = 40;
  return Object.assign(server, { stopRentalRelay: relay.stop });
}
async function readBody(req, limit = 16384) {
  if (!req.headers["content-type"]?.startsWith("application/json"))
    throw new HttpError(415, "JSON i\xE7erik gerekli.");
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new HttpError(413, "\u0130stek \xE7ok b\xFCy\xFCk.");
    chunks.push(chunk);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body;
  } catch {
    throw new HttpError(400, "Ge\xE7ersiz JSON iste\u011Fi.");
  }
}

// apps/api/src/index.ts
async function main() {
  const port = Number(process.env.PORT ?? 8080);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535)
    throw new IdentityStartupError("CONFIG_PORT");
  const rateSecret = process.env.AUTH_RATE_SECRET ?? "";
  if (rateSecret.length < 32) throw new IdentityStartupError("CONFIG_SECRET");
  const { store, client } = await connectAccounts(
    process.env.MONGODB_URI ?? "",
    process.env.MONGODB_DATABASE ?? "nodera"
  );
  const server = createIdentityServer(store, {
    rateSecret,
    trustProxy: process.env.TRUST_PROXY === "1",
    directory: directoryOptions()
  });
  server.listen(
    port,
    process.env.HOST ?? "0.0.0.0",
    () => console.log(`Nodera \xFCyelik API\u2019si ${port} portunda haz\u0131r.`)
  );
  server.on("error", (error) => {
    console.error(identityStartupFailure(error));
    void client.close().finally(() => process.exit(1));
  });
  function stop() {
    server.stopRentalRelay();
    server.close(() => {
      void client.close().finally(() => process.exit(0));
    });
    server.closeIdleConnections();
  }
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}
void main().catch((error) => {
  console.error(identityStartupFailure(error));
  process.exitCode = 1;
});
