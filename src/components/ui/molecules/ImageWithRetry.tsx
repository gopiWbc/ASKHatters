import React, { useCallback, useRef, useState } from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  StyleSheet,
  ImageProps,
  Text,
} from 'react-native';
import ClickableView from '../atoms/ClickableOpacity';

interface ImageWithRetryProps extends ImageProps {
  maxRetries?: number;
  retryDelay?: number; // ms
  onRetry?: (retryCount: number) => void;
  fallbackText?: string;
}

const ImageWithRetry: React.FC<ImageWithRetryProps> = ({
  source,
  maxRetries = 3,
  retryDelay = 1000,
  onRetry,
  fallbackText = 'Tap to retry',
  style,
  ...props
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const retryTimeout = useRef<number | null>(null);

  const retryLoad = useCallback(() => {
    if (retryCount >= maxRetries) return;

    onRetry?.(retryCount + 1);

    retryTimeout.current && clearTimeout(retryTimeout.current);

    retryTimeout.current = setTimeout(() => {
      setRetryCount((c) => c + 1);
      setLoading(true);
      setError(false);
    }, retryDelay);
  }, [retryCount, maxRetries, retryDelay, onRetry]);

  return (
    <ClickableView
      activeOpacity={0.7}
      disabled={!error}
      onClick={retryLoad}
    >
        <Image
          {...props}
          key={`${retryCount}`} // forces reload
          source={source}
          style={style}
          onLoadStart={() => {
            setLoading(true);
            setError(false);
          }}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
            retryLoad();
          }}
        />

        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {error && retryCount >= maxRetries && (
          <View style={styles.overlay}>
            <Text style={styles.retryText}>{fallbackText}</Text>
          </View>
        )}
    </ClickableView>
  );
};

export default ImageWithRetry;
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    fontSize: 12,
    color: '#666',
  },
});
