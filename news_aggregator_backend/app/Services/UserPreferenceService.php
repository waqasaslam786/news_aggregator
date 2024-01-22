<?php
namespace App\Services;

use App\Models\{UserPreference};

class UserPreferenceService
{
    public function getUserPrefrences($userId = null)
    {
        $userPreferences = UserPreference::with('preferenceable')
            ->where('user_id', $userId)
            ->get();

        $preferenceData = [];
        if ($userPreferences) {

            // handlePreferencesRocord function for prepare preference record separatly
            $preferenceData = $this->handlePreferencesRocord($userPreferences);
        } else {

            $preferenceData = [
                'sources' => [],
                'categories' => [],
                'authors' => [],
            ];
        }

        return $preferenceData;
    }

    public function handlePreferencesRocord($userPreferences)
    {
        $preferenceData = [
            'sources' => [],
            'categories' => [],
            'authors' => [],
        ];

        foreach ($userPreferences as $preference) {
            $type = $preference->preferenceable_type;

            if (isset($preference->preferenceable)) {
                switch ($type) {
                    case makeModelPath('Source'):
                        $preferenceData['sources'][] = $preference->preferenceable;
                        break;

                    case makeModelPath('Category'):
                        $preferenceData['categories'][] = $preference->preferenceable;
                        break;

                    case makeModelPath('Author'):
                        $preferenceData['authors'][] = $preference->preferenceable;
                        break;

                    default:
                        break;
                }
            }
        }

        return $preferenceData;
    }
}
