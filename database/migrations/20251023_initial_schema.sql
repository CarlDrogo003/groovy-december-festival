-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'hotel_owner', 'customer');
CREATE TYPE room_type AS ENUM ('single', 'double', 'suite', 'deluxe');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create hotel_profiles table
CREATE TABLE hotel_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    role user_role DEFAULT 'customer',
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
CREATE TABLE hotels (
    id UUID DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES hotel_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create rooms table
CREATE TABLE rooms (
    id UUID DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    type room_type NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INT NOT NULL,
    amenities JSONB,
    image_urls TEXT[],
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE(hotel_id, room_number)
);

-- Create bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES hotel_profiles(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status booking_status DEFAULT 'pending',
    payment_reference TEXT,
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
-- Create reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES hotel_profiles(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE(booking_id)
);
-- Hotel Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON hotel_profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON hotel_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Hotels policies
CREATE POLICY "Hotels are viewable by everyone"
    ON hotels FOR SELECT
    USING (true);

CREATE POLICY "Hotel owners can insert hotels"
    ON hotels FOR INSERT
    WITH CHECK (auth.uid() = owner_id AND EXISTS (
        SELECT 1 FROM hotel_profiles
        WHERE id = auth.uid() AND role = 'hotel_owner'
    ));

CREATE POLICY "Hotel owners can update own hotels"
    ON hotels FOR UPDATE
    USING (auth.uid() = owner_id);

-- Rooms policies
CREATE POLICY "Rooms are viewable by everyone"
    ON rooms FOR SELECT
    USING (true);

CREATE POLICY "Hotel owners can manage rooms"
    ON rooms FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM hotels
            WHERE id = rooms.hotel_id AND owner_id = auth.uid()
        )
    );

-- Bookings policies
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Hotel owners can view their hotels' bookings"
    ON bookings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM hotels
            WHERE id = (SELECT hotel_id FROM rooms WHERE id = room_id)
            AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews for their bookings"
    ON reviews FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM bookings
            WHERE id = booking_id
            AND user_id = auth.uid()
            AND status = 'completed'
        )
    );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_hotel_profiles_updated_at
    BEFORE UPDATE ON hotel_profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
    BEFORE UPDATE ON hotels
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();