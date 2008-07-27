/*-------------------------------------------------------------------------
 *    FieldHints version 1.1
 *    http://pauldowman.com/projects/fieldhints
 *
 *    Copyright 2007 Paul Dowman, http://pauldowman.com/
 *
 *    FieldHints is free software; you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation; either version 2 of the License, or
 *    (at your option) any later version.
 *
 *    FieldHints is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *    
 *--------------------------------------------------------------------------
 *  
 *  This script requires the Prototype JavaScript library:
 *  http://prototypejs.org
 *
 *--------------------------------------------------------------------------*/


var FieldHints = {
    
    fieldWithHintClass: 'fieldWithHint',
    labelClass: 'hintText',

    initialize: function() {
        var labels = $$('label.hintText');
        var f = FieldHints.initializeField.bind(FieldHints);
        labels.each(f);
    },
    
    // Registers a blur handler and a focus handler for the field, and adds a
    // submit handler to a chain of submit handlers for the form.
    initializeField: function(label) {
        var fieldId = label.htmlFor;
        if (!fieldId) return;

        var field = $(fieldId);
        if (!field) return;
            
        if (!field.fieldHintsInitialized) {
            field.fieldHintsInitialized = true;
            var hint = label.innerHTML.strip();
            var form = field.form;
            
            this.addFocusHandler(field, hint);
            this.addBlurHandler(field, hint);
            
            var oldSubmitHandler;
            if (form.onsubmit) oldSubmitHandler = form.onsubmit.bind(form);
            field.form.onsubmit = this.hintSubmitHandler(hint, field, oldSubmitHandler);
            
            this.doBlur(field, hint);
        }
    },
    
    addFocusHandler: function(field, hint) {
      field.observe('focus', function(ev) {
        var el = Event.element(ev);
        if (el.value.strip() == hint) {
          el.value = '';
        }
        el.removeClassName(FieldHints.fieldWithHintClass);
      });
    },
    
    addBlurHandler: function(field, hint) {
      var obj = this;
      field.observe('blur', function(ev) {
        var el = Event.element(ev);
        obj.doBlur(el, hint)
      });
    },
    
    doBlur: function(el, hint) {
      if (el.value == '') el.value = hint;
      if (el.value == hint) el.addClassName(FieldHints.fieldWithHintClass);
    },
    
    // If the field never received focus then it will still have the hint text
    // in it. In that case it should be empty on submit, instead of submitting
    // the hint text, so register a submit handler for the form. There may
    // already be a submit handler on the form, so we need to keep a reference
    // to it and call it at the end.
    hintSubmitHandler: function(hint, field, oldSubmitHandler) {
        return function() {
            if (field.value == hint) {
                field.value = ''
                $(this).removeClassName(FieldHints.fieldWithHintClass);
            }
            if (oldSubmitHandler) {
                try {
                    var retval = oldSubmitHandler();
                } catch (error) {
                    return false;
                }
                return retval;
            } else {
                return true;
            }
        }
    }
    
}

