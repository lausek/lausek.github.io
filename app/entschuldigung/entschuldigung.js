document.addEventListener('DOMContentLoaded', function() {
  const template_single = 'Hiermit entschuldige ich mich für mein Fehlen am %date_name1%, den %date_at%, %reason%.';
  
  const template_range = 'Hiermit entschuldige ich mich für mein Fehlen vom %date_name1%, den %date_from%, bis zum %date_name2%, den %date_to%, %reason%.';
  
  const reasons = [
    'da ich krank war',
    'da ich wegen Krankheit daheim bleiben musste',
    'da ich einen Termin wahrnehmen musste',
    'da ich einen Termin beim Zahnarzt hatte',
    'da ich einen Arzttermin hatte',
    'da ich arbeiten musste',
    'da ich einen Termin beim Proktologen hatte',
  ];

  function get_date_format(date) {
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
  }
  
  function get_day_name(idx) {
    switch(idx) {
      case 0: return 'Sonntag';
      case 1: return 'Montag';
      case 2: return 'Dienstag';
      case 3: return 'Mittwoch';
      case 4: return 'Donnerstag';
      case 5: return 'Freitag';
      case 6: return 'Samstag';
      default: throw 'Not a valid day index';
    }
  }
  
  function replace(str, map) {
    let output = str;
    for ([key, val] of map.entries()) {
      output = output.replace(`%${key}%`, val);
    }
    return output;
  }
  
  function get_vars() {
    return {
      name: document.getElementById('p_name').value,
      date_at: document.getElementById('p_date_at').value,
      date_from: document.getElementById('p_date_from').value,
      date_to: document.getElementById('p_date_to').value,
      reason: document.getElementById('p_reason').value,
      date_is_single: document.getElementById('p_date_is_single').checked,
      reason_is_random: document.getElementById('p_reason_is_random').checked,
    };
  }

  function change() {
    let vars = get_vars();
    let date_single = vars.date_is_single;
    let reason_random = vars.reason_is_random;
    
    let reason_idx = Math.floor(Math.random() * reasons.length);
    let reason = vars.reason_is_random ? reasons[reason_idx] : vars.reason;
    let template = vars.date_is_single ? template_single : template_range;
    
    let date_at = new Date(vars.date_at);
    let date_from = new Date(vars.date_from);
    let date_to = new Date(vars.date_to);
    
    let params = new Map();
    params.set('name', vars.name);
    params.set('reason', reason);
    params.set('date_at', get_date_format(date_at));
    params.set('date_from', get_date_format(date_from));
    params.set('date_to', get_date_format(date_to));
    
    if (vars.date_is_single) {
      params.set('date_name1', get_day_name(date_at.getDay()));
    } else {
      params.set('date_name1', get_day_name(date_from.getDay()));
      params.set('date_name2', get_day_name(date_to.getDay()));
    }
    
    let new_output = replace(template, params);
    
    document.getElementById('o_text').innerHTML = new_output;
    document.getElementById('o_name').innerHTML = vars.name;
  }
  
  function addChange(node) {
    node.onchange = change;
  }
  
  function initialize() {
    let today = new Date();
    document.getElementById('o_today').innerHTML = get_date_format(today);
    
    document.getElementById('p_date_at').value = today;
    document.getElementById('p_date_from').value = today;
    document.getElementById('p_date_to').value = today;
  }
  
  initialize();
  
  for (let node of document.getElementsByClassName('refresh')) {
    node.onclick = change;
  }
  
  addChange(document.getElementById('p_name'));
  addChange(document.getElementById('p_date_at'));
  addChange(document.getElementById('p_date_from'));
  addChange(document.getElementById('p_date_to'));
  
  addChange(document.getElementById('p_date_is_single'));
  addChange(document.getElementById('p_date_is_range'));
  addChange(document.getElementById('p_reason_is_random'));
  addChange(document.getElementById('p_reason_is_custom'));
  
  change();
});
