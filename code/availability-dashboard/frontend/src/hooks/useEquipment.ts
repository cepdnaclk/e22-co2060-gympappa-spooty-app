import { useEffect, useState } from 'react';
import axios from 'axios';
import { Equipment } from '../types';

const useEquipment = () => {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await axios.get('/api/equipment');
                setEquipment(response.data);
            } catch (err) {
                setError('Failed to fetch equipment data');
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    return { equipment, loading, error };
};

export default useEquipment;