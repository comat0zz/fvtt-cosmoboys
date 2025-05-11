import { CZT } from "./config.mjs";
import { registerSystemSettings } from "./settings.mjs";
import { initializeHandlebars } from "./handlebars/init.mjs";
import * as CztUtility from "./utilities/_module.mjs";

import { SimpleActorSheet } from "./SimpleActorSheet.mjs";
import { SimpleActor } from "./SimpleActor.mjs";

//import { SimpleItem } from "./SimpleItem.mjs";
//import { SimpleItemSheet } from "./SimpleItemSheet.mjs";

/* -------------------------------------------- */
/*  Define Module Structure                     */
/* -------------------------------------------- */

globalThis.cosmoboys = {
    config: CZT
}

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */
Hooks.once("init", async function() {
  globalThis.cosmoboys = game.cosmoboys = Object.assign(game.system, globalThis.cosmoboys);
  game.logger = new CztUtility.Log(true);
  game.system_path = `systems/${game.system.id}`;
  game.assets_path = `${game.system_path}/assets`;
  game.template_path = `${game.system_path}/templates`;
  
  CONFIG.CZT = CZT;
  CONFIG.Actor.documentClass = SimpleActor;

  registerSystemSettings();

  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet(game.system.id, SimpleActorSheet, { 
    types: ["hero"], 
    makeDefault: true,
    label: "TYPES.Actor.Hero"
  });

  initializeHandlebars();

});

