
-- 1. Restrict ai_chatbot_settings: drop public SELECT
DROP POLICY IF EXISTS "Public can read AI settings" ON public.ai_chatbot_settings;

-- 2. Restrict whatsapp_settings: drop public SELECT
DROP POLICY IF EXISTS "Public can read WhatsApp settings" ON public.whatsapp_settings;

-- 3. Public-safe function for chatbot display settings (no system_prompt/tone/etc.)
CREATE OR REPLACE FUNCTION public.get_public_chat_settings()
RETURNS TABLE (
  is_enabled boolean,
  greeting_message text,
  greeting_message_hi text,
  whatsapp_cta_text text,
  whatsapp_cta_text_hi text,
  whatsapp_cta_enabled boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_enabled, greeting_message, greeting_message_hi,
         whatsapp_cta_text, whatsapp_cta_text_hi, whatsapp_cta_enabled
  FROM public.ai_chatbot_settings
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_chat_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_chat_settings() TO anon, authenticated;

-- 4. Public-safe function for WhatsApp display settings
CREATE OR REPLACE FUNCTION public.get_public_whatsapp_settings()
RETURNS TABLE (
  phone_number text,
  is_enabled boolean,
  default_message text,
  default_message_hi text,
  product_inquiry_message text,
  product_inquiry_message_hi text,
  bulk_order_message text,
  bulk_order_message_hi text,
  distributor_message text,
  distributor_message_hi text,
  show_floating_button boolean,
  button_position text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT phone_number, is_enabled, default_message, default_message_hi,
         product_inquiry_message, product_inquiry_message_hi,
         bulk_order_message, bulk_order_message_hi,
         distributor_message, distributor_message_hi,
         show_floating_button, button_position
  FROM public.whatsapp_settings
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_whatsapp_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_whatsapp_settings() TO anon, authenticated;

-- 5. Tighten chat_logs INSERT with validation
DROP POLICY IF EXISTS "Anyone can insert chat logs" ON public.chat_logs;
CREATE POLICY "Anyone can insert chat logs"
ON public.chat_logs
FOR INSERT
WITH CHECK (
  char_length(session_id) BETWEEN 1 AND 128
  AND char_length(user_message) BETWEEN 1 AND 4000
  AND (ai_response IS NULL OR char_length(ai_response) <= 8000)
  AND (language IS NULL OR language IN ('en','hi'))
);

-- 6. Revoke direct EXECUTE on trigger-only helper functions
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
