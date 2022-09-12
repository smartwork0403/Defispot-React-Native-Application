/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useEffect, useMemo, useState} from 'react';

import {useDispatch} from 'react-redux';

import {
  decryptFromKeystore,
  encryptToKeyStore,
  generatePhrase,
  Keystore,
  validatePhrase,
} from '@xchainjs/xchain-crypto';
import {useFilePicker} from 'use-file-picker';

import {actions as AppActions} from '../redux/app/app-slice';

import {downloadAsFile} from '../helpers/download';

export const useKeystore = ({onConnect}) => {
  const dispatch = useDispatch();

  const [keystore, setKeystore] = useState<Keystore>();
  const [password, setPassword] = useState<string>('');
  const [invalideStatus, setInvalideStatus] = useState(false);
  const [keystoreError, setKeystoreError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [
    openFileSelector,
    {filesContent, loading: fileLoading, errors, clear},
  ] = useFilePicker({
    accept: '.txt',
  });

  const onChangeFile = useCallback((file: String) => {
    try {
      const key = JSON.parse(file as string);
      if (!('version' in key) || !('crypto' in key)) {
        setKeystoreError('Not a valid keystore file');
      } else {
        setKeystoreError('');
        setKeystore(key);
      }
    } catch {
      setKeystoreError('Not a valid json file');
    }
  }, []);

  useEffect(() => {
    if (filesContent.length > 0) {
      onChangeFile(filesContent[0].content);
    }
  }, [filesContent, onChangeFile]);

  const onPasswordChange = useCallback((text: string) => {
    setPassword(text);
    setInvalideStatus(false);
  }, []);
  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      if (password !== text) {
        setInvalideStatus(true);
      } else {
        setInvalideStatus(false);
      }
    },
    [password],
  );
  const unlock = useCallback(async () => {
    if (keystore) {
      setProcessing(true);

      try {
        const phrase = await decryptFromKeystore(keystore, password);

        setPassword('');
        setKeystore(undefined);
        setProcessing(false);
        clear();
        onConnect(keystore, phrase);
      } catch (error) {
        setProcessing(false);

        setInvalideStatus(true);
      }
    }
  }, [keystore, password, clear, onConnect]);
  const ready = useMemo(
    () => password.length > 0 && password === confirmPassword && !keystoreError,
    [password, confirmPassword, keystoreError],
  );
  const handleCreate = useCallback(async () => {
    if (ready) {
      setProcessing(true);

      try {
        const phrase = generatePhrase();

        console.log('phrase enter');

        const isValid = validatePhrase(phrase);
        console.log('phrase enter', isValid);

        if (!isValid) {
          return;
        }

        console.log('keystoreValue enter');

        const keystoreValue = await encryptToKeyStore(phrase, password);

        console.log('keystoreValue leave');

        // await downloadAsFile(
        //   'defispot-keystore.txt',
        //   JSON.stringify(keystoreValue),
        // );

        // clean up
        setPassword('');
        setConfirmPassword('');
        console.log('on connect enter');

        onConnect(keystoreValue, phrase);
        console.log('on connect leave');

        return phrase;
      } catch (error) {
        console.log(error);
        setInvalideStatus(true);
        dispatch(
          AppActions.setNotification({
            type: 'error',
            text: 'error creating wallet',
          }),
        );
      }
      setProcessing(false);
    } else {
      dispatch(
        AppActions.setNotification({
          type: 'error',
          text: 'Passwords must match',
        }),
      );
    }
  }, [ready, password, onConnect]);

  return {
    handleCreate,
    onPasswordChange,
    openFileSelector,
    handleConfirmPasswordChange,
    unlock,
    fileLoading,
    filesContent,
    invalideStatus,
    processing,
    errors,
    keystore,
    keystoreError,
    ready,
  };
};
