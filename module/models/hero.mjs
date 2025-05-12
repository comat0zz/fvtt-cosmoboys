// https://foundryvtt.wiki/en/development/api/DataModel
export default class Hero extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = {};

        schema.description = new fields.HTMLField({ required: true, textSearch: true });

        // Раны, сердечки
        schema.wound = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 3, min: 0, max: 5 })
        });

        // Число персонажа
        schema.char_number = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 7, min: 3, max: 11 })
        });

        // Оружие
        schema.weapon = new fields.SchemaField({
            value: new fields.StringField({ required: false, nullable: false, initial: "" })
        });

        // Транспорт
        schema.carriage = new fields.SchemaField({
            value: new fields.StringField({ required: false, nullable: false, initial: "" })
        });

        // Архетип
        schema.archetype = new fields.SchemaField({
            value: new fields.StringField({ required: false, nullable: false, initial: "" }),
            desc: new fields.HTMLField({ required: false, textSearch: true })
        });

        // Вспышка
        schema.flash = new fields.SchemaField({
            value: new fields.StringField({ required: false, nullable: false, initial: "" }),
            desc: new fields.HTMLField({ required: false, textSearch: true })
        });

        // Дополнительные айтемы
        schema.things = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }), // Unused but kept for compatibility
            item_1: new fields.StringField({ required: false, nullable: false, initial: "" }),
            item_2: new fields.StringField({ required: false, nullable: false, initial: "" }),
            item_3: new fields.StringField({ required: false, nullable: false, initial: "" }),
            item_4: new fields.StringField({ required: false, nullable: false, initial: "" }),
            item_5: new fields.StringField({ required: false, nullable: false, initial: "" }),
            item_6: new fields.StringField({ required: false, nullable: false, initial: "" })
        });

        return schema;
    }

    /** @override */
    prepareDerivedData() {
        super.prepareDerivedData();
        let updates = {};

        if (Object.keys(updates).length > 0) {
            this.parent.update(updates);
        }
    }
}