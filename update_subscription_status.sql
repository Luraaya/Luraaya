-- Update existing subscription statuses to match our app's plan types
-- First, let's see what we have
SELECT id, subscription_status, subscription_plan FROM users WHERE subscription_status IS NOT NULL;

-- Update trialing status to basic or premium based on subscription_plan
UPDATE users 
SET subscription_status = 'basic' 
WHERE subscription_status = 'trialing' 
AND subscription_plan = 'price_1S0NPcKiq4sl1mQHxoX5raaJ';

UPDATE users 
SET subscription_status = 'premium' 
WHERE subscription_status = 'trialing' 
AND subscription_plan = 'price_1S0hBNKiq4sl1mQHYJYYjLbz';

-- Update active status to basic or premium based on subscription_plan
UPDATE users 
SET subscription_status = 'basic' 
WHERE subscription_status = 'active' 
AND subscription_plan = 'price_1S0NPcKiq4sl1mQHxoX5raaJ';

UPDATE users 
SET subscription_status = 'premium' 
WHERE subscription_status = 'active' 
AND subscription_plan = 'price_1S0hBNKiq4sl1mQHYJYYjLbz';

-- Show the updated results
SELECT id, subscription_status, subscription_plan FROM users WHERE subscription_status IS NOT NULL;
