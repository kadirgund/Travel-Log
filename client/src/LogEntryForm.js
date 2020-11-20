import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createLogEntry, updateLogEntry } from './API';

const LogEntryForm = (
	{ 
		latitude, 
		longitude, 
		onClose, 
		isUpdateForm, 
		title,
		comments,
		image,
		description,
		id, 
	}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
			setLoading(true);
			if (isUpdateForm) {
				await updateLogEntry({...data, id});
				onClose();
			}
			else {
	      await createLogEntry({ ...data, longitude, latitude });
				onClose();
			}
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='entry-form'>
      {error && <h3 className="error">{error}</h3>}
			{(!loading && !isUpdateForm) && <h3>Fill in the form to create a new log!</h3>}
			<label htmlFor='apiKey'>API KEY</label>
      <input name='apiKey' required type="password" ref={register} />
      <label htmlFor='title'>Title</label>
      <input name='title' required ref={register} placeholder={title}></input>
      <label htmlFor='comments'>Comments</label>
      <textarea name='comments' rows={3} ref={register} placeholder={comments}></textarea>
      <label htmlFor='description'>Description</label>
      <textarea name='description' rows={3} ref={register} placeholder={description}></textarea>
      <label htmlFor='image'>Image</label>
			<input name='image' ref={register} placeholder={image}/>
      <label htmlFor='visitDate'>Visit Date</label>
      <input name='visitDate' type='date' required ref={register} />
      <button disabled={loading}>
        {loading && 'Loading...'}
				{(!loading && isUpdateForm) && 'Update Log'}
				{(!loading && !isUpdateForm) && 'Create New Log'}
      </button>
    </form>
  );
};

export default LogEntryForm;
