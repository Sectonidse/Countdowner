const St = imports.gi.St;
const Main = imports.ui.main;
const Desklet = imports.ui.desklet;
const Settings = imports.ui.settings;
const Lang = imports.lang;
const Pango = imports.gi.Pango;
const Clutter = imports.gi.Clutter;
let customDateString;

function CountdownDesklet(metadata, desklet_id) {
    this._init(metadata, desklet_id);
}



CountdownDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata, desklet_id) {
        this.metadata = metadata;
        this.settings = new Settings.DeskletSettings(this, this.metadata["uuid"], desklet_id);
        this.settings.bindProperty(Settings.BindingDirection.IN,
                                   "datetimeing",
                                   "datetimeing",
                                   this._on_settings_changed,
                                   null);
        this.settings.bindProperty(Settings.BindingDirection.IN,
                                   "customtext",
                                   "customtext",
                                   this._on_settings_changed,
                                   null);
        this.settings.bindProperty(Settings.BindingDirection.IN,
                                   "showseconds",
                                   "showseconds",
                                   this._on_settings_changed,
                                   null);
        this.settings.bindProperty(Settings.BindingDirection.IN,
                                   "customfinish",
                                   "customfinish",
                                   this._on_settings_changed,
                                   null);
        this.settings.bindProperty(Settings.BindingDirection.IN,
                                   "backgroundcolor",
                                   "backgroundcolor",
                                   this._on_settings_changed,
                                   null);
        this.settings.bindProperty(Settings.BindingDirection.IN,
                                   "textcolor1",
                                   "textcolor1",
                                   this._on_settings_changed,
                                   null);
        this.settings.bindProperty(Settings.BindingDirection.IN,
                                   "textsize",
                                   "textsize",
                                   this._on_settings_changed,
                                   null);

        Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);

        this._label = new St.Label({
            text: "Countdown",
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            x_expand: true,
            y_expand: true,
            style_class: 'countdown-label'
        });
        this.setContent(this._label);

        

        this._updateCountdown();
    },

    _on_settings_changed: function() {
            console.log("BEEP BEEP BEEP: locator updated (not a quake 2 reference lmao)");
    },

    _updateCountdown: function() {
        this.targetDate = new Date(this.datetimeing);
        let currentDate = new Date();
        let timeDifference = this.targetDate - currentDate;

        if (timeDifference > 0) {
            let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            let countdownText = "";
            console.log(this.showseconds);
            
            if (this.showseconds) {
              countdownText =
                  `<span font_desc='${this.textsize}'><b>Time left until ${this.customtext}:</b>&#13;&#10;</span>` +
                  `<span font_desc='${this.textsize}'><b>${days}</b> days</span>` +
                  ` <span font_desc='${this.textsize}'><b>${hours}</b> hours</span>` +
                  ` <span font_desc='${this.textsize}'><b>${minutes}</b> minutes</span>` +
                  ` <span font_desc='${this.textsize}'><b>${seconds}</b> seconds</span>`;}
            else {
              countdownText =
                  `<span font_desc='${this.textsize}'><b>Time left until ${this.customtext}:</b>&#13;&#10;</span>` +
                  `<span font_desc='${this.textsize}'><b>${days}</b> days</span>` +
                  ` <span font_desc='${this.textsize}'><b>${hours}</b> hours</span>` +
                  ` <span font_desc='${this.textsize}'><b>${minutes}</b> minutes</span>`;}

            this._label.get_clutter_text().set_markup(countdownText);
            
            this._label.style = `background-color: ${this.backgroundcolor}; color: ${this.textcolor1};`;
        } else {
            this._label.get_clutter_text().set_markup(`<span font_desc='${this.textsize}'>${this.customfinish}</span>`);
        }

        // Update every second
        imports.mainloop.timeout_add_seconds(1, Lang.bind(this, this._updateCountdown));
    },

    on_settings_changed: function() {
        // Handle settings changes if needed
    }
};

function main(metadata, desklet_id) {
    return new CountdownDesklet(metadata, desklet_id);
}

