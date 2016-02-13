#include <pebble.h>

static Window *window;
static TextLayer *text_layer;

static void inbox_received_callback(DictionaryIterator *iterator, void *context) {
  Tuple *data = dict_find(iterator, 0);
  if (data) {
    text_layer_set_text(text_layer, data->value->cstring);
  }
}

static void window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  text_layer = text_layer_create(GRect(0, 20, bounds.size.w, 100));
  text_layer_set_text(text_layer, "Liveconfig - Open settings!");
  text_layer_set_text_alignment(text_layer, GTextAlignmentCenter);
  text_layer_set_overflow_mode(text_layer, GTextOverflowModeWordWrap);
  layer_add_child(window_layer, text_layer_get_layer(text_layer));
}

static void window_unload(Window *window) {
  text_layer_destroy(text_layer);
}

static void init(void) {
  window = window_create();
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload
  });
  window_stack_push(window, true);
  app_message_register_inbox_received(inbox_received_callback);
  app_message_open(128, 64);
}

static void deinit(void) {
  window_destroy(window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
