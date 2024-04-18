import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Rating } from '@kolking/react-native-rating';
import { LocationSchemaType } from '@xhoantran/common';
import { useTheme } from '@/theme';
import Carousel from 'react-native-reanimated-carousel';



interface LocationDetailsProps {
	location: LocationSchemaType;
}

const styles = StyleSheet.create({
	slideBar: {
		width: 40,
		height: 5,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		borderRadius: 5,
		alignSelf: 'center',
	},
	scrollView: {
		marginTop: 10,
		width: '100%', // Use full width of the screen
		display: 'flex',
		flexDirection: 'column',
	},
	slideView: {
		backgroundColor: '#ffffff', // White background for each item
		borderWidth: 1,
		borderColor: '#e0e0e0', // Lighter border color
		borderRadius: 20, // Rounded corners
		padding: 16, // Padding inside each item
		marginBottom: 10, // Space between items
		shadowOpacity: 0.1,
	},
	slideItem: {
		paddingBottom: 5,
	},

	imageContainer: {
		borderRadius: 4,
		width: '100%',
		height: 150,
	},
});



function LocationDetails({ location }: LocationDetailsProps) {
	const { layout, gutters, fonts } = useTheme();

	if (!location) {
		return <Text>Loading location details...</Text>; // Or handle the absence differently
	}

	const calculateRating = (sum: number, count: number): number => {
		return count === 0 ? 0 : sum / count;
	};

	const { width } = useWindowDimensions();

	return (
		<View
			style={[
				layout.col,
				layout.fullWidth,
				gutters.paddingHorizontal_16,
				gutters.paddingVertical_12,
			]}
		>
			<View style={styles.imageContainer}>
				{location.image ? (
					<Carousel
					loop
					width={width}
					height={width / 2}
					autoPlay={true}
					data={[...new Array(6).keys()]}
					scrollAnimationDuration={1000}
					onSnapToItem={(index) => console.log('current index:', index)}
					renderItem={({ index }) => (
							<View style={styles.imageContainer}>
								<Image
									style={styles.imageContainer}
									source={{ uri: location.images[index] || 'https://via.placeholder.com/150'}}
									alt="Location image"
								/>
							</View>

					)}
					/>
				) : (
					<Image
						style={styles.imageContainer}
						alt="No image available"
						source={{
							uri: 'https://via.placeholder.com/150',
						}}
					/>
				)}
			</View>

			<Text
				style={[gutters.marginTop_8, fonts.size_16, fonts.bold, fonts.gray900]}
			>
				{location.name}
			</Text>

			<View style={[gutters.marginTop_8, layout.row, layout.itemsCenter]}>
				<Rating
					size={17}
					rating={calculateRating(
						location.difficultyRateValue,
						location.difficultyRateCount,
					)}
					disabled
				/>
				<Text
					style={[
						gutters.marginLeft_8,
						fonts.size_12,
						fonts.medium,
						fonts.gray500,
					]}
				>
					{location.difficultyRateCount}
				</Text>
			</View>

			{/* Types */}
			<View style={gutters.marginTop_4}>
				<Text style={[fonts.size_12, fonts.medium, fonts.gray600]}>
					Types:{' '}
					{location.types.length === 0 ? 'N/A' : location.types.join(', ')}
				</Text>
			</View>

			{/* Maximum Depth */}
			<View style={gutters.marginTop_4}>
				<Text style={[fonts.size_12, fonts.medium, fonts.gray600]}>
					Maximum Depth:{' '}
					{location.maximumDepth
						? `${location.maximumDepth.metters.toPrecision(
								4,
						  )}m / ${location.maximumDepth.feet.toPrecision(4)}ft`
						: 'N/A'}
				</Text>
			</View>
		</View>
	);
}

export default LocationDetails;
