import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Button, Input, Modal } from '../common';
import './FixedAssetForm.css'; // Assuming you have a CSS file for styling

const FixedAssetForm = ({ assetId, onClose, onSave }) => {
    const [asset, setAsset] = useState({});
    const { get, post, put } = useApi();

    useEffect(() => {
        if (assetId) {
            get(`/api/fixed-assets/${assetId}`)
                .then(response => setAsset(response.data))
                .catch(error => console.error('Error fetching fixed asset:', error));
        }
    }, [assetId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAsset(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
        const request = assetId ? put : post;
        const url = assetId ? `/api/fixed-assets/${assetId}` : '/api/fixed-assets';

        request(url, asset)
            .then(response => {
                onSave(response.data);
                onClose();
            })
            .catch(error => console.error('Error saving fixed asset:', error));
    };

    return (
        <Modal onClose={onClose}>
            <h2>{assetId ? 'Edit Fixed Asset' : 'Create Fixed Asset'}</h2>
            <Input
                label="Name"
                name="name"
                value={asset.name || ''}
                onChange={handleChange}
            />
            <Input
                label="Value"
                name="value"
                value={asset.value || ''}
                onChange={handleChange}
            />
            <Button onClick={handleSave}>{assetId ? 'Update' : 'Save'}</Button>
        </Modal>
    );
};

export default FixedAssetForm;
